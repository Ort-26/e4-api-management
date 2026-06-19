import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { MasTicket } from '../domain/mas-ticket.type';

type MasTicketCreationAttributes = Optional<
  MasTicket,
  'ticketId' | 'createdAt' | 'updatedAt' | 'statusId'
>;

export class MasTicketModel
  extends Model<MasTicket, MasTicketCreationAttributes>
  implements MasTicket
{
  declare ticketId: number;
  declare ticketTitle: string;
  declare ticketDesc: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare statusId: number;
}

MasTicketModel.init(
  {
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'ticket_id',
    },
    ticketTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'ticket_title',
    },
    ticketDesc: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'ticket_desc',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
    },
    statusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'status_id',
    },
  },
  {
    sequelize,
    modelName: 'MasTicket',
    tableName: 'mas_tickets',
    timestamps: false,
  },
);
