import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import sequelize from './sequelize';

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
      type: DataTypes.STRING(256),
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
  db.Comment.belongsTo(db.User);
  db.Comment.belongsTo(db.Post);
  db.Comment.hasMany(db.DeclareComment);
  db.Comment.belongsToMany(db.User, { through: 'COMMENT_LIKE', as: 'likers' });
};
export default Comment;
