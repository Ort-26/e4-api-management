import { sequelize } from '../../config/sequelize';
import { MasTicket } from '../../models/domain/mas-ticket.type';
import { MasComment } from '../../models/domain/mas-comment.type';
import { MasUser } from '../../models/domain/mas-user.type';
import { CatRole } from '../../models/domain/cat-role.type';
import { CatTicketStatuses } from '../../models/domain/cat-ticket-statuses.type';
import { CreateTicketRequest } from '../../models/request/CreateTicketRequest.type';
import { CommentDto } from '../../models/dto/CommentDto';
import { TicketDetail } from '../../models/response/TicketDetail.type';
import { CatRolesModel } from '../../models/sequelize/CatRolesModel';
import { CatTicketStatusesModel } from '../../models/sequelize/CatTicketStatusesModel';
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
    if (!MasTicketModel.associations.status) {
      MasTicketModel.belongsTo(CatTicketStatusesModel, {
        foreignKey: 'statusId',
        targetKey: 'statusId',
        as: 'status',
      });
    }

    if (!MasTicketModel.associations.agent) {
      MasTicketModel.belongsTo(MasUserModel, {
        foreignKey: 'agentId',
        targetKey: 'userId',
        as: 'agent',
      });
    }

    if (!MasUserModel.associations.role) {
      MasUserModel.belongsTo(CatRolesModel, {
        foreignKey: 'roleId',
        targetKey: 'roleId',
        as: 'role',
      });
    }

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

  async getTicketById(ticketId: number): Promise<MasTicket | null> {
    const record = await MasTicketModel.findOne({
      where: { ticketId },
    });

    return record ? record.get({ plain: true }) : null;
  }

  async getAllTickets(): Promise<MasTicket[]> {
    const records = await MasTicketModel.findAll({
      order: [['ticketId', 'ASC']],
    });

    return records.map((record) => record.get({ plain: true }));
  }

  async getTicketsByUserId(userId: number): Promise<MasTicket[]> {
    const ticketLinks = await MasTicketsUsersModel.findAll({
      where: { userId },
      attributes: ['ticketId'],
    });

    const ticketIds = ticketLinks.map((link) => link.ticketId);

    if (ticketIds.length === 0) {
      return [];
    }

    const records = await MasTicketModel.findAll({
      where: { ticketId: ticketIds },
      order: [['ticketId', 'ASC']],
    });

    return records.map((record) => record.get({ plain: true }));
  }

  async getUserIdsByTicketId(ticketId: number): Promise<number[]> {
    const ticketLinks = await MasTicketsUsersModel.findAll({
      where: { ticketId },
      attributes: ['userId'],
      order: [['userId', 'ASC']],
    });

    return ticketLinks.map((link) => link.userId);
  }

  async getTicketDetail(ticketId: number): Promise<TicketDetail | null> {
    const record = await MasTicketModel.findOne({
      where: { ticketId },
      include: [
        {
          model: CatTicketStatusesModel,
          as: 'status',
          required: false,
        },
        {
          model: MasUserModel,
          as: 'agent',
          required: false,
          include: [
            {
              model: CatRolesModel,
              as: 'role',
              required: false,
            },
          ],
        },
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
              include: [
                {
                  model: CatRolesModel,
                  as: 'role',
                  required: false,
                },
              ],
            },
          ],
        },
      ],
      order: [[{ model: MasCommentModel, as: 'comments' }, 'createdAt', 'ASC']],
    });

    if (!record) return null;
    

    const plain = record.get({ plain: true }) as MasTicket & {
      status?: CatTicketStatuses;
      agent?: MasUser & { role?: CatRole };
      comments?: Array<MasComment & { user?: MasUser & { role?: CatRole } }>;
    };

    if (!plain.status) {
      return null;
    }

    const comments: CommentDto[] = (plain.comments ?? [])
      .filter((comment) => Boolean(comment.user) && Boolean(comment.user?.role))
      .map((comment) => ({
        commentId: comment.commentId,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        user: {
          userId: (comment.user as MasUser).userId,
          username: (comment.user as MasUser).userName,
          userLastName: (comment.user as MasUser).userLastname,
          email: (comment.user as MasUser).email,
          role: (comment.user as MasUser & { role: CatRole }).role,
        },
      }));

    const agent = plain.agent && plain.agent.role
      ? {
          userId: plain.agent.userId,
          username: plain.agent.userName,
          userLastName: plain.agent.userLastname,
          email: plain.agent.email,
          role: plain.agent.role,
        }
      : null;

    return {
      ticket: {
        ticketId: plain.ticketId,
        ticketTitle: plain.ticketTitle,
        ticketDesc: plain.ticketDesc,
        createdAt: plain.createdAt,
        updatedAt: plain.updatedAt,
        status: plain.status,
        agent,
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
