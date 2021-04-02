import { DataTypes, Model } from 'sequelize';
import { DbType, sequelize } from './index';

class Post extends Model {
  public readonly id!: string;
  public state!: number;
  public title!: string;
  public content!: string;
  public allowComments!: boolean;
  public license!: string;
  public summary!: string;
  public isPrimary!: boolean;
  public hits!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Post.init(
  {
    state: { type: DataTypes.TINYINT(), allowNull: false, defaultValue: 0 },
    title: { type: DataTypes.STRING(128), allowNull: false },
    content: { type: DataTypes.TEXT(), allowNull: false },
    allowComment: {
      type: DataTypes.TINYINT(),
      allowNull: false,
      defaultValue: 0,
    },
    license: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: 'open',
    },
    summary: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    isPrimary: {
      type: DataTypes.TINYINT(),
      allowNull: false,
      defaultValue: 0,
    },
    hits: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    sequelize,
    tableName: 'POST',
    modelName: 'Post',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associatePost = (db: DbType): void => {
  console.log(db);
};
export default Post;
