import { MasTicket } from "../domain/mas-ticket.type";
import { TicketComment } from "../dto/TicketComment.type";

export interface TicketDetail {
    ticket: MasTicket;
    comments: TicketComment[];
} 