export interface HisAssignationChange {
  hisStatusId: number;
  ticketId: number;
  oldUser: number | null;
  newUser: number;
  changedBy: number;
  updatedAt: Date;
}
