import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import sequelize from './sequelize';

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
  public thumbnail?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Post.init(
  {
    state: { type: DataTypes.TINYINT(), allowNull: false, defaultValue: 0 },
    title: { type: DataTypes.STRING(256), allowNull: false },
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
    thumbnail: {
      type: DataTypes.STRING(128),
    },
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
  db.Post.hasMany(db.PostImage);
  db.Post.hasMany(db.PostLog);
  db.Post.hasMany(db.DeclarePost);
  db.Post.hasMany(db.Comment);
  db.Post.belongsTo(db.User);
  db.Post.belongsToMany(db.User, { through: 'LIKE', as: 'liker' });
  db.Post.belongsToMany(db.HashTag, { through: 'POST_HASHTAG' });
  db.Post.belongsToMany(db.PicStory, { through: 'STORY_POST' });
};
export default Post;
