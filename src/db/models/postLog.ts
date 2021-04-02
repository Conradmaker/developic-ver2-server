import { DataTypes, Model } from 'sequelize';
import { DbType, sequelize } from './index';

class PostLog extends Model {
  public readonly id!: string;

  public date!: string;
  public score!: 1 | 2;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
  console.log(db);
};
export default PostLog;
