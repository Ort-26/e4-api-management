import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { MasTicketsUsers } from '../domain/mas-tickets-users.type';

export class MasTicketsUsersModel
  extends Model<MasTicketsUsers>
  implements MasTicketsUsers
{
  declare userId: number;
  declare ticketId: number;
}

MasTicketsUsersModel.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'user_id',
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'ticket_id',
    },
  },
  {
    sequelize,
    modelName: 'MasTicketsUsers',
    tableName: 'mas_tickets_mas_users',
    timestamps: false,
  },
);