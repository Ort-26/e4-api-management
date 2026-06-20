import { CatTicketStatuses } from '../../models/domain/cat-ticket-statuses.type';
import { MasTicket } from '../../models/domain/mas-ticket.type';
import { AuthTokenPayload } from '../../models/dto/Auth.type';
import { CreateTicketRequest } from '../../models/request/CreateTicketRequest.type';
import { TicketDetail } from '../../models/response/TicketDetail.type';

export interface ITicketsService {
  getAllTickets(): Promise<MasTicket[]>;
  getTicketsByUserId(userId: number): Promise<MasTicket[]>;
  getUserIdsByTicketId(ticketId: number): Promise<number[]>;
  getTicketDetail(ticketId: number): Promise<TicketDetail | null>;
  createTicket(payload: CreateTicketRequest, userId: number): Promise<MasTicket>;
  getAvailableTransitions(ticketId: number, authProfile: AuthTokenPayload): Promise<CatTicketStatuses[]>;
}
