import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { HisTicketStatusChange } from '../domain/his-ticket-status-change.type';

type HisTicketStatusChangeCreationAttributes = Optional<HisTicketStatusChange, 'hisChangeId' | 'updatedAt'>;

export class HisTicketStatusChangeModel
  extends Model<HisTicketStatusChange, HisTicketStatusChangeCreationAttributes>
  implements HisTicketStatusChange
{
  declare hisChangeId: number;
  declare ticketId: number;
  declare oldStatus: number;
  declare newStatus: number;
  declare changedBy: number;
  declare updatedAt: Date;
  declare statusId: number;
}

HisTicketStatusChangeModel.init(
  {
    hisChangeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'his_change_id',
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'ticket_id',
    },
    oldStatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'old_status',
    },
    newStatus: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'new_status',
    },
    changedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'changed_by',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'status_id',
    },
  },
  {
    sequelize,
    modelName: 'HisTicketStatusChange',
    tableName: 'his_ticket_status_changes',
    timestamps: false,
  },
);
