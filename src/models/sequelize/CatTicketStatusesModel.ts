import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { CatTicketStatuses } from '../domain/cat-ticket-statuses.type';

type CatTicketStatusCreationAttributes = Optional<CatTicketStatuses, 'statusId'>;

export class CatTicketStatusesModel
  extends Model<CatTicketStatuses, CatTicketStatusCreationAttributes>
  implements CatTicketStatuses
{
  declare statusId: number;
  declare statusCode: string;
  declare statusName: string;
  declare statusDesc: string;
}

CatTicketStatusesModel.init(
  {
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'status_id',
    },
    statusCode: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'status_code',
    },
    statusName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'status_name',
    },
    statusDesc: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'status_desc',
    },
  },
  {
    sequelize,
    modelName: 'CatTicketStatus',
    tableName: 'cat_ticket_statuses',
    timestamps: false,
  },
);
