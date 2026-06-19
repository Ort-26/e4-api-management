export interface HisTicketStatusChange {
  hisChangeId: number;
  ticketId: number;
  oldStatus: number;
  newStatus: number;
  changedBy: number;
  updatedAt: Date;
  statusId: number;
}
