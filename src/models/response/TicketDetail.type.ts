import { CommentDto } from "../dto/CommentDto";
import { TicketDto } from "../dto/TicketDto";

export interface TicketDetail {
    ticket: TicketDto;
    comments: CommentDto[];
} 