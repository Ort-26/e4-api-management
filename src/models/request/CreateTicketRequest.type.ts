export interface CreateTicketRequest {
  ticketTitle: string;
  ticketDesc?: string;
  statusId?: number;
}