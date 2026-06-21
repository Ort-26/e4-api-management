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
import { HisTicketStatusChangeModel } from '../../models/sequelize/HisTicketStatusChangeModel';
import { HisAssignationChangeModel } from '../../models/sequelize/HisAssignationChangeModel';
import { ITicketsRepository } from '../interfaces/ITicketsRepository';
import { TransitionRes } from '../../models/response/TransitionRes';
import { AssignRes } from '../../models/response/AssignRes';
import { TicketDto } from '../../models/dto/TicketDto';

export class TicketsRepository implements ITicketsRepository {
  constructor() {
    this.configureAssociations();
  }

  private mapTicketToDto(ticket: MasTicket & { status?: CatTicketStatuses; agent?: MasUser & { role?: CatRole } }): TicketDto | null {
    if (!ticket.status) {
      return null;
    }

    const agent = ticket.agent && ticket.agent.role
      ? {
          userId: ticket.agent.userId,
          username: ticket.agent.userName,
          userLastName: ticket.agent.userLastname,
          email: ticket.agent.email,
          role: ticket.agent.role,
        }
      : null;

    return {
      ticketId: ticket.ticketId,
      ticketTitle: ticket.ticketTitle,
      ticketDesc: ticket.ticketDesc,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      status: ticket.status,
      agent,
    };
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

  async getTicketById(ticketId: number): Promise<TicketDto | null> {
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
      ],
    });

    if (!record) {
      return null;
    }

    const plain = record.get({ plain: true }) as MasTicket & {
      status?: CatTicketStatuses;
      agent?: MasUser & { role?: CatRole };
    };

    return this.mapTicketToDto(plain);
  }

  async getAllTickets(): Promise<TicketDto[]> {
    const records = await MasTicketModel.findAll({
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
      ],
      order: [['ticketId', 'ASC']],
    });

    return records
      .map((record) => {
        const plain = record.get({ plain: true }) as MasTicket & {
          status?: CatTicketStatuses;
          agent?: MasUser & { role?: CatRole };
        };
        return this.mapTicketToDto(plain);
      })
      .filter((ticket): ticket is TicketDto => Boolean(ticket));
  }

  async getTicketsByUserId(userId: number): Promise<TicketDto[]> {
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
      ],
      order: [['ticketId', 'ASC']],
    });

    return records
      .map((record) => {
        const plain = record.get({ plain: true }) as MasTicket & {
          status?: CatTicketStatuses;
          agent?: MasUser & { role?: CatRole };
        };
        return this.mapTicketToDto(plain);
      })
      .filter((ticket): ticket is TicketDto => Boolean(ticket));
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

  async addCommentToTicket(ticketId: number, content: string, userId: number): Promise<MasComment> {
    const transaction = await sequelize.transaction();

    try {
      const now = new Date();
      const commentRecord = await MasCommentModel.create(
        {
          content,
          commentedBy: userId,
          createdAt: now,
          updatedAt: now,
        },
        { transaction },
      );

      await MasTicketsCommentsModel.create(
        {
          ticketId,
          commentId: commentRecord.commentId,
        },
        { transaction },
      );

      await transaction.commit();

      return commentRecord.get({ plain: true });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async transitionTicketStatus(ticketId: number, newStatusId: number, changedBy: number): Promise<{ ticketId: number; oldStatus: number; newStatus: number; updatedAt: Date }> {
    const transaction = await sequelize.transaction();

    try {
      const ticketRecord = await MasTicketModel.findOne({
        where: { ticketId },
        transaction,
      });

      if (!ticketRecord) {
        throw new Error('TICKET_NOT_FOUND');
      }

      const oldStatus = ticketRecord.statusId;
      const now = new Date();

      ticketRecord.statusId = newStatusId;
      ticketRecord.updatedAt = now;
      await ticketRecord.save({ transaction });

      await HisTicketStatusChangeModel.create(
        {
          ticketId,
          oldStatus,
          newStatus: newStatusId,
          changedBy,
          updatedAt: now,
          statusId: newStatusId,
        },
        { transaction },
      );

      await transaction.commit();

      return {
        ticketId,
        oldStatus,
        newStatus: newStatusId,
        updatedAt: now,
      } as TransitionRes;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async assignAgentToTicket(ticketId: number, agentId: number, changedBy: number): Promise<AssignRes> {
    const transaction = await sequelize.transaction();

    try {
      const ticketRecord = await MasTicketModel.findOne({
        where: { ticketId },
        transaction,
      });

      if (!ticketRecord) {
        throw new Error('TICKET_NOT_FOUND');
      }

      const agentRecord = await MasUserModel.findOne({
        where: { userId: agentId },
        include: [
          {
            model: CatRolesModel,
            as: 'role',
            required: false,
          },
        ],
        transaction,
      });

      if (!agentRecord) {
        throw new Error('AGENT_NOT_FOUND');
      }

      const plainAgent = agentRecord.get({ plain: true }) as MasUser & { role?: CatRole };
      if (!plainAgent.role || plainAgent.role.roleName !== 'AGENT') {
        throw new Error('INVALID_AGENT_ROLE');
      }

      const oldAgentId = ticketRecord.agentId;
      const now = new Date();

      ticketRecord.agentId = agentId;
      ticketRecord.updatedAt = now;
      await ticketRecord.save({ transaction });

      await HisAssignationChangeModel.create(
        {
          ticketId,
          oldUser: oldAgentId,
          newUser: agentId,
          changedBy,
          updatedAt: now,
        },
        { transaction },
      );

      await transaction.commit();

      return {
        ticketId,
        oldAgentId,
        newAgentId: agentId,
        updatedAt: now,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

