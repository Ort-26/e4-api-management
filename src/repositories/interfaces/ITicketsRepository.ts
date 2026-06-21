import { MasTicket } from '../../models/domain/mas-ticket.type';
import { MasComment } from '../../models/domain/mas-comment.type';
import { CreateTicketRequest } from '../../models/request/CreateTicketRequest.type';
import { TicketDetail } from '../../models/response/TicketDetail.type';
import { TransitionRes } from '../../models/response/TransitionRes';
import { AssignRes } from '../../models/response/AssignRes';
import { TicketDto } from '../../models/dto/TicketDto';

export interface ITicketsRepository {
  getAllTickets(): Promise<TicketDto[]>;
  getTicketById(ticketId: number): Promise<TicketDto | null>;
  getTicketsByUserId(userId: number): Promise<TicketDto[]>;
  getUserIdsByTicketId(ticketId: number): Promise<number[]>;
  getTicketDetail(ticketId: number): Promise<TicketDetail | null>;
  createTicket(payload: CreateTicketRequest, userId: number): Promise<MasTicket>;
  addCommentToTicket(ticketId: number, content: string, userId: number): Promise<MasComment>;
  transitionTicketStatus(ticketId: number, newStatusId: number, changedBy: number): Promise<TransitionRes>;
  assignAgentToTicket(ticketId: number, agentId: number, changedBy: number): Promise<AssignRes>;
}
