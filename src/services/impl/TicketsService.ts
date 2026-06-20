import { CatPermission } from '../../models/domain/cat-permission.type';
import { CatTicketStatuses } from '../../models/domain/cat-ticket-statuses.type';
import { MasComment } from '../../models/domain/mas-comment.type';
import { MasTicket } from '../../models/domain/mas-ticket.type';
import { AuthTokenPayload } from '../../models/dto/Auth.type';
import { CreateTicketRequest } from '../../models/request/CreateTicketRequest.type';
import { TicketDetail } from '../../models/response/TicketDetail.type';
import { TransitionRes } from '../../models/response/TransitionRes';
import { AssignRes } from '../../models/response/AssignRes';
import { IRolesRepository } from '../../repositories/interfaces/IRolesRepository';
import { ITicketsRepository } from '../../repositories/interfaces/ITicketsRepository';
import { ITicketTransitionsRepository } from '../../repositories/interfaces/ITicketTransitionsRepository';
import { ITicketsService } from '../interfaces/ITicketsService';

export class TicketsService implements ITicketsService {
  private ticketsRepository: ITicketsRepository;
  private ticketTransitionsRepository: ITicketTransitionsRepository;
  private rolesRepository: IRolesRepository;

  constructor(ticketsRepository: ITicketsRepository, ticketTransitionsRepository: ITicketTransitionsRepository, rolesRepository: IRolesRepository) {
    this.ticketsRepository = ticketsRepository;
    this.ticketTransitionsRepository = ticketTransitionsRepository;
    this.rolesRepository = rolesRepository;
  }

  async getAvailableTransitions(ticketId: number, authProfile: AuthTokenPayload): Promise<CatTicketStatuses[]> {
    const ticketDetail = await this.ticketsRepository.getTicketById(ticketId);
    if (!ticketDetail) throw new Error('Ticket not found');
    const permissions: CatPermission[] = await this.rolesRepository.getPermissionsByRoleId(authProfile.roleId);
    const permissionIds = permissions.map(p => p.permissionId);
    return await this.ticketTransitionsRepository.getAvailableTransitions(ticketDetail.statusId, permissionIds); 
  }

  async getAllTickets(): Promise<MasTicket[]> {
    return await this.ticketsRepository.getAllTickets();
  }

  async getTicketsByUserId(userId: number): Promise<MasTicket[]> {
    return await this.ticketsRepository.getTicketsByUserId(userId);
  }

  async getUserIdsByTicketId(ticketId: number): Promise<number[]> {
    return await this.ticketsRepository.getUserIdsByTicketId(ticketId);
  }

  async getTicketDetail(ticketId: number): Promise<TicketDetail | null> {
    return await this.ticketsRepository.getTicketDetail(ticketId);
  }

  async createTicket(payload: CreateTicketRequest, userId: number): Promise<MasTicket> {
    return await this.ticketsRepository.createTicket(payload, userId);
  }

  async addCommentToTicket(ticketId: number, content: string, userId: number): Promise<MasComment | null> {
    const ticket = await this.ticketsRepository.getTicketById(ticketId);
    if (!ticket) {
      return null;
    }

    return await this.ticketsRepository.addCommentToTicket(ticketId, content.trim(), userId);
  }

  async transitionTicket(ticketId: number, statusId: number, authProfile: AuthTokenPayload): Promise<TransitionRes | null> {
    const ticket = await this.ticketsRepository.getTicketById(ticketId);
    if (!ticket) return null;

    const permissions: CatPermission[] = await this.rolesRepository.getPermissionsByRoleId(authProfile.roleId);
    const permissionIds = permissions.map((permission) => permission.permissionId);
    const availableTransitions = await this.ticketTransitionsRepository.getAvailableTransitions(ticket.statusId, permissionIds);
    const canTransition = availableTransitions.some((status) => status.statusId === statusId);

    if (!canTransition) {
      throw new Error('INVALID_TRANSITION');
    }

    return await this.ticketsRepository.transitionTicketStatus(ticketId, statusId, authProfile.userId);
  }

  async assignAgentToTicket(ticketId: number, agentId: number, authProfile: AuthTokenPayload): Promise<AssignRes | null> {
    const ticket = await this.ticketsRepository.getTicketById(ticketId);
    if (!ticket) return null;
    return await this.ticketsRepository.assignAgentToTicket(ticketId, agentId, authProfile.userId);
  }
}
