import { MasTicket } from '../../models/domain/mas-ticket.type';
import { CreateTicketRequest } from '../../models/request/CreateTicketRequest.type';
import { TicketDetail } from '../../models/response/TicketDetail.type';
import { ITicketsRepository } from '../../repositories/interfaces/ITicketsRepository';
import { ITicketsService } from '../interfaces/ITicketsService';

export class TicketsService implements ITicketsService {
  private ticketsRepository: ITicketsRepository;

  constructor(ticketsRepository: ITicketsRepository) {
    this.ticketsRepository = ticketsRepository;
  }

  async getAllTickets(): Promise<MasTicket[]> {
    return await this.ticketsRepository.getAllTickets();
  }

  async getTicketDetail(ticketId: number): Promise<TicketDetail | null> {
    return await this.ticketsRepository.getTicketDetail(ticketId);
  }

  async createTicket(payload: CreateTicketRequest, userId: number): Promise<MasTicket> {
    return await this.ticketsRepository.createTicket(payload, userId);
  }
}
