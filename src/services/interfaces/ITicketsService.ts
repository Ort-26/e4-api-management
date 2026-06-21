import { CatTicketStatuses } from '../../models/domain/cat-ticket-statuses.type';
import { MasComment } from '../../models/domain/mas-comment.type';
import { MasTicket } from '../../models/domain/mas-ticket.type';
import { AuthTokenPayload } from '../../models/dto/Auth.type';
import { CreateTicketRequest } from '../../models/request/CreateTicketRequest.type';
import { TicketDetail } from '../../models/response/TicketDetail.type';
import { AssignRes } from '../../models/response/AssignRes';
import { TicketDto } from '../../models/dto/TicketDto';

export interface ITicketsService {
  getAllTickets(): Promise<TicketDto[]>;
  getTicketsByUserId(userId: number): Promise<TicketDto[]>;
  getUserIdsByTicketId(ticketId: number): Promise<number[]>;
  getTicketDetail(ticketId: number): Promise<TicketDetail | null>;
  createTicket(payload: CreateTicketRequest, userId: number): Promise<MasTicket>;
  addCommentToTicket(ticketId: number, content: string, userId: number): Promise<MasComment | null>;
  getAvailableTransitions(ticketId: number, authProfile: AuthTokenPayload): Promise<CatTicketStatuses[]>;
  transitionTicket(ticketId: number, statusId: number, authProfile: AuthTokenPayload): Promise<{ ticketId: number; oldStatus: number; newStatus: number; updatedAt: Date } | null>;
}
