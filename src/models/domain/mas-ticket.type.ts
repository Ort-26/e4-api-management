export interface MasTicket {
  ticketId: number;
  ticketTitle: string;
  ticketDesc: string;
  createdAt: Date;
  updatedAt: Date;
  statusId: number;
  agentId: number | null;
}
