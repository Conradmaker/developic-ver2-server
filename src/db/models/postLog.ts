import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import Post from './post';
import sequelize from './sequelize';

class PostLog extends Model {
  public readonly id!: string;

  public date!: string;
  public score!: 1 | 2;
  public type!: 'view' | 'like';
  public PostId!: number;
  public UserId?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public Post?: Post;
}

PostLog.init(
  {
    date: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: new Date(),
    },
    score: {
      type: DataTypes.TINYINT(),
      allowNull: false,
      defaultValue: 1,
    },
    type: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'view',
    },
    UserId: {
      type: DataTypes.INTEGER(),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: 'POSTS_LOG',
    modelName: 'PostsLog',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associatePostLog = (db: DbType): void => {
  db.PostLog.belongsTo(db.Post, { onDelete: 'CASCADE' });
};
export default PostLog;
