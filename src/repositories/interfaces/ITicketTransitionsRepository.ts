import { CatTicketStatuses } from "../../models/domain/cat-ticket-statuses.type";

export interface ITicketTransitionsRepository {
  getAvailableTransitions(fromStatus: number, permissions: number[]): Promise<CatTicketStatuses[]>;
}