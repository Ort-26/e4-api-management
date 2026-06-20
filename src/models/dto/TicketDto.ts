import { CatTicketStatuses } from "../domain/cat-ticket-statuses.type";
import { UserDto } from "./UserDto";

export interface TicketDto {
  ticketId: number;
  ticketTitle: string;
  ticketDesc: string;
  createdAt: Date;
  updatedAt: Date;
  status: CatTicketStatuses;
  agent: UserDto | null;
}