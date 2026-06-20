import { MasTicketsUsersModel } from "../../models/sequelize/MasTicketsUsersModel";
import { ITicketsUsersRepository } from "../interfaces/ITicketsUsersRepository";

export class TicketsUsersRepository implements ITicketsUsersRepository {
  async getUsersByTicketId(ticketId: number): Promise<number[]> {
    const records = await MasTicketsUsersModel.findAll({
      where: { ticketId },
      attributes: ['userId'],
    });

    return records.map((record) => record.userId);
  }
}