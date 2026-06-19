import { CatTicketStatuses } from "../../models/domain/cat-ticket-statuses.type";

export interface ICatalogsService {
    getAllTicketStatuses(): Promise<CatTicketStatuses[]>;
}