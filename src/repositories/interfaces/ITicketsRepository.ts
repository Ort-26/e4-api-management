import { MasTicket } from '../../models/domain/mas-ticket.type';
import { CreateTicketRequest } from '../../models/request/CreateTicketRequest.type';
import { TicketDetail } from '../../models/response/TicketDetail.type';

export interface ITicketsRepository {
  getAllTickets(): Promise<MasTicket[]>;
  getTicketById(ticketId: number): Promise<MasTicket | null>;
  getTicketsByUserId(userId: number): Promise<MasTicket[]>;
  getUserIdsByTicketId(ticketId: number): Promise<number[]>;
  getTicketDetail(ticketId: number): Promise<TicketDetail | null>;
  createTicket(payload: CreateTicketRequest, userId: number): Promise<MasTicket>;
}
