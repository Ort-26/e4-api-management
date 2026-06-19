import { CatTicketStatuses } from "../../models/domain/cat-ticket-statuses.type";

export interface ICatalogsRepository {
	getAllTicketStatuses(): Promise<CatTicketStatuses[]>;
}