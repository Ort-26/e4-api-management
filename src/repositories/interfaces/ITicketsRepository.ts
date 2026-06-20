import { MasTicket } from '../../models/domain/mas-ticket.type';
import { MasComment } from '../../models/domain/mas-comment.type';
import { CreateTicketRequest } from '../../models/request/CreateTicketRequest.type';
import { TicketDetail } from '../../models/response/TicketDetail.type';
import { TransitionRes } from '../../models/response/TransitionRes';
import { AssignRes } from '../../models/response/AssignRes';

export interface ITicketsRepository {
  getAllTickets(): Promise<MasTicket[]>;
  getTicketById(ticketId: number): Promise<MasTicket | null>;
  getTicketsByUserId(userId: number): Promise<MasTicket[]>;
  getUserIdsByTicketId(ticketId: number): Promise<number[]>;
  getTicketDetail(ticketId: number): Promise<TicketDetail | null>;
  createTicket(payload: CreateTicketRequest, userId: number): Promise<MasTicket>;
  addCommentToTicket(ticketId: number, content: string, userId: number): Promise<MasComment>;
  transitionTicketStatus(ticketId: number, newStatusId: number, changedBy: number): Promise<TransitionRes>;
  assignAgentToTicket(ticketId: number, agentId: number, changedBy: number): Promise<AssignRes>;
}
