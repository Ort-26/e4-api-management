import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { HisAssignationChange } from '../domain/his-assignation-change.type';

type HisAssignationChangeCreationAttributes = Optional<HisAssignationChange, 'hisStatusId' | 'updatedAt'>;

export class HisAssignationChangeModel
  extends Model<HisAssignationChange, HisAssignationChangeCreationAttributes>
  implements HisAssignationChange
{
  declare hisStatusId: number;
  declare ticketId: number;
  declare oldUser: number | null;
  declare newUser: number;
  declare changedBy: number;
  declare updatedAt: Date;
}

HisAssignationChangeModel.init(
  {
    hisStatusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'his_status_id',
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'ticket_id',
    },
    oldUser: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'old_user',
    },
    newUser: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'new_user',
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
  },
  {
    sequelize,
    modelName: 'HisAssignationChange',
    tableName: 'his_assignation_changes',
    timestamps: false,
  },
);
