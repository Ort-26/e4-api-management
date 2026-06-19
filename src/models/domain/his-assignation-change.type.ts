export interface HisAssignationChange {
  hisStatusId: number;
  ticketId: number;
  oldUser: number;
  newUser: number;
  changedBy: number;
  updatedAt: Date;
}
