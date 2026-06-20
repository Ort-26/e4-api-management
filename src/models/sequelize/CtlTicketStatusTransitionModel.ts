import { DataTypes, Model, NonAttribute } from "sequelize";
import { CtlTicketStatusTransition } from "../domain/ctl-ticket-status-transition.type"; 
import { sequelize } from "../../config/sequelize";
import { CatTicketStatusesModel } from "./CatTicketStatusesModel";

export class CtlTicketStatusTransitionModel extends Model<CtlTicketStatusTransition> implements CtlTicketStatusTransition {
    declare transitionId: number;
    declare fromStatus: number;
    declare toStatus: number;
    declare permissionId: number;
    
    declare fromStatusDetails?: NonAttribute<CatTicketStatusesModel>;
    declare toStatusDetails?: NonAttribute<CatTicketStatusesModel>;
}

CtlTicketStatusTransitionModel.init(
    {
        transitionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'transition_id',
        },
        fromStatus: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'from_status',
        },
        toStatus: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'to_status',
        },
        permissionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'permission_id',
        },
    },
    {
        sequelize,
        modelName: 'CtlTicketStatusTransition',
        tableName: 'ctl_ticket_status_transitions',
        timestamps: false,
    }
);

CtlTicketStatusTransitionModel.belongsTo(CatTicketStatusesModel, {
    foreignKey: 'fromStatus',
    targetKey: 'statusId',
    as: 'fromStatusDetails',
});

CtlTicketStatusTransitionModel.belongsTo(CatTicketStatusesModel, {
    foreignKey: 'toStatus',
    targetKey: 'statusId',
    as: 'toStatusDetails',
});