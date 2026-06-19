import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { MasTicketsComments } from '../domain/mas-tickets-comments.type';

export class MasTicketsCommentsModel
  extends Model<MasTicketsComments>
  implements MasTicketsComments
{
  declare ticketId: number;
  declare commentId: number;
}

MasTicketsCommentsModel.init(
  {
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'ticket_id',
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'comment_id',
    },
  },
  {
    sequelize,
    modelName: 'MasTicketsComments',
    tableName: 'mas_tickets_comments',
    timestamps: false,
  },
);