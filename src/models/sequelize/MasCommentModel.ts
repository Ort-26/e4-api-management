import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { MasComment } from '../domain/mas-comment.type';

type MasCommentCreationAttributes = Optional<MasComment, 'commentId'>;

export class MasCommentModel
  extends Model<MasComment, MasCommentCreationAttributes>
  implements MasComment
{
  declare commentId: number;
  declare content: string;
  declare commentedBy: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

MasCommentModel.init(
  {
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'comment_id',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'content',
    },
    commentedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'commented_by',
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
  },
  {
    sequelize,
    modelName: 'MasComment',
    tableName: 'mas_comments',
    timestamps: false,
  },
);