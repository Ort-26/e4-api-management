import { CatPermission } from '../../models/domain/cat-permission.type';
import { CatTicketStatuses } from '../../models/domain/cat-ticket-statuses.type';
import { MasTicket } from '../../models/domain/mas-ticket.type';
import { AuthTokenPayload } from '../../models/dto/Auth.type';
import { CreateTicketRequest } from '../../models/request/CreateTicketRequest.type';
import { TicketDetail } from '../../models/response/TicketDetail.type';
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
}
