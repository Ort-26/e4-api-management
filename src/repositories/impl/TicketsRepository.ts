import { sequelize } from '../../config/sequelize';
import { MasTicket } from '../../models/domain/mas-ticket.type';
import { MasComment } from '../../models/domain/mas-comment.type';
import { MasUser } from '../../models/domain/mas-user.type';
import { CreateTicketRequest } from '../../models/request/CreateTicketRequest.type';
import { TicketComment } from '../../models/dto/TicketComment.type';
import { TicketDetail } from '../../models/response/TicketDetail.type';
import { MasCommentModel } from '../../models/sequelize/MasCommentModel';
import { MasTicketModel } from '../../models/sequelize/MasTicketModel';
import { MasTicketsCommentsModel } from '../../models/sequelize/MasTicketsCommentsModel';
import { MasTicketsUsersModel } from '../../models/sequelize/MasTicketsUsersModel';
import { MasUserModel } from '../../models/sequelize/MasUserModel';
import { ITicketsRepository } from '../interfaces/ITicketsRepository';

export class TicketsRepository implements ITicketsRepository {
  constructor() {
    this.configureAssociations();
  }

  private configureAssociations(): void {
    if (!MasTicketModel.associations.comments) {
      MasTicketModel.belongsToMany(MasCommentModel, {
        through: MasTicketsCommentsModel,
        foreignKey: 'ticketId',
        otherKey: 'commentId',
        as: 'comments',
      });
    }

    if (!MasCommentModel.associations.tickets) {
      MasCommentModel.belongsToMany(MasTicketModel, {
        through: MasTicketsCommentsModel,
        foreignKey: 'commentId',
        otherKey: 'ticketId',
        as: 'tickets',
      });
    }

    if (!MasCommentModel.associations.user) {
      MasCommentModel.belongsTo(MasUserModel, {
        foreignKey: 'commentedBy',
        targetKey: 'userId',
        as: 'user',
      });
    }
  }

  async getAllTickets(): Promise<MasTicket[]> {
    const records = await MasTicketModel.findAll({
      order: [['ticketId', 'ASC']],
    });

    return records.map((record) => record.get({ plain: true }));
  }

  async getTicketDetail(ticketId: number): Promise<TicketDetail | null> {
    const record = await MasTicketModel.findOne({
      where: { ticketId },
      include: [
        {
          model: MasCommentModel,
          as: 'comments',
          through: { attributes: [] },
          required: false,
          include: [
            {
              model: MasUserModel,
              as: 'user',
              required: false,
            },
          ],
        },
      ],
      order: [[{ model: MasCommentModel, as: 'comments' }, 'createdAt', 'ASC']],
    });

    if (!record) {
      return null;
    }

    const plain = record.get({ plain: true }) as MasTicket & {
      comments?: Array<MasComment & { user?: MasUser }>;
    };

    const comments: TicketComment[] = (plain.comments ?? [])
      .filter((comment) => Boolean(comment.user))
      .map((comment) => ({
        comment: {
          commentId: comment.commentId,
          content: comment.content,
          commentedBy: comment.commentedBy,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        },
        user: comment.user as MasUser,
      }));

    return {
      ticket: {
        ticketId: plain.ticketId,
        ticketTitle: plain.ticketTitle,
        ticketDesc: plain.ticketDesc,
        createdAt: plain.createdAt,
        updatedAt: plain.updatedAt,
        statusId: plain.statusId,
      },
      comments,
    };
  }

  async createTicket(payload: CreateTicketRequest, userId: number): Promise<MasTicket> {
    const transaction = await sequelize.transaction();

    try {
      const now = new Date();
      const ticketRecord = await MasTicketModel.create(
        {
          ticketTitle: payload.ticketTitle,
          ticketDesc: payload.ticketDesc?.trim() || '',
          createdAt: now,
          updatedAt: now,
          statusId: payload.statusId ?? 1,
        },
        { transaction },
      );

      await MasTicketsUsersModel.create(
        {
          userId,
          ticketId: ticketRecord.ticketId,
        },
        { transaction },
      );

      await transaction.commit();

      return ticketRecord.get({ plain: true });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export const ticketsRepository = new TicketsRepository();
