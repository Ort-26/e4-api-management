import { Op } from "sequelize";
import { CatTicketStatuses } from "../../models/domain/cat-ticket-statuses.type";
import { CatTicketStatusesModel } from "../../models/sequelize/CatTicketStatusesModel";
import { CtlTicketStatusTransitionModel } from "../../models/sequelize/CtlTicketStatusTransitionModel";
import { ITicketTransitionsRepository } from "../interfaces/ITicketTransitionsRepository";

export class TicketTransitionRepository implements ITicketTransitionsRepository {
    async getAvailableTransitions(fromStatus: number, permissions: number[]): Promise<CatTicketStatuses[]> {
        const transitions = await CtlTicketStatusTransitionModel.findAll({
            where: { 
                fromStatus, 
                permissionId: {
                    [Op.in]: permissions
                } },
            include: [
                { 
                    model: CatTicketStatusesModel, 
                    as: 'toStatusDetails',
                    attributes: ['statusId', 'statusCode', 'statusName', 'statusDesc'],
                }
            ],
            attributes: []
        });
        return transitions.map(transition => transition.toStatusDetails)
        .filter((status): status is CatTicketStatusesModel => Boolean(status))
        .map(status => status.get({ plain: true }) as CatTicketStatuses);
    }
}