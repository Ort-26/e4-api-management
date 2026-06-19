import { MasComment } from "../domain/mas-comment.type";
import { MasUser } from "../domain/mas-user.type";

export interface TicketComment {
    comment: MasComment;
    user: MasUser;
}