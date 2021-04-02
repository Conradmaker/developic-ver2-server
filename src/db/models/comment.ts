import { DataTypes, Model } from 'sequelize';
import { DbType, sequelize } from './index';

class Comment extends Model {
  public readonly id!: string;

  public content!: string;
  public mentionedUser?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Comment.init(
  {
    content: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    mentionedUser: {
      type: DataTypes.STRING(50),
    },
  },
  {
    sequelize,
    tableName: 'COMMENT',
    modelName: 'Comment',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associateComment = (db: DbType): void => {
  console.log(db);
};
export default Comment;
