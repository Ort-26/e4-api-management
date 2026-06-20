export interface ITicketsUsersRepository {
    getUsersByTicketId(ticketId: number): Promise<number[]>;
}