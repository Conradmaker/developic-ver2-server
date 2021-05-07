import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationsMixin,
  DataTypes,
  Model,
} from 'sequelize';
import { DbType } from '.';
import HashTag from './hashtag';
import PicStory from './picStory';
import sequelize from './sequelize';
import User from './user';

class Post extends Model {
  public readonly id!: string;
  public state!: number;
  public title!: string;
  public content!: string;
  public allowComment!: boolean;
  public license!: string;
  public summary!: string;
  public isPublic!: boolean;
  public hits!: number;
  public thumbnail?: string;
  public UserId?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public addHashTags!: BelongsToManyAddAssociationsMixin<HashTag, number>;
  public addHashTag!: BelongsToManyAddAssociationMixin<HashTag, number>;
  public removeHashTags!: BelongsToManyRemoveAssociationsMixin<HashTag, string>;
  public getHashTags!: BelongsToManyGetAssociationsMixin<HashTag>;

  public addLiker!: BelongsToManyAddAssociationMixin<User, number>;
  public removeLikers!: BelongsToManyRemoveAssociationsMixin<User, string>;
  public getLikers!: BelongsToManyGetAssociationsMixin<User>;

  public likeCount?: number;
  public likers?: User[];
  public PicStories?: PicStory[];
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
    },
    isPublic: {
      type: DataTypes.TINYINT(),
      allowNull: false,
      defaultValue: 1,
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
  db.Post.belongsToMany(db.User, { through: 'POST_LIKE', as: 'likers' });
  db.Post.belongsToMany(db.HashTag, { through: 'POST_HASHTAG' });
  db.Post.belongsToMany(db.PicStory, { through: 'STORY_POST' });
};
export default Post;
