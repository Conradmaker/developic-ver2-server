import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationsMixin,
  DataTypes,
  Model,
} from 'sequelize';
import { DbType } from '.';
import Post from './post';
import sequelize from './sequelize';

class HashTag extends Model {
  public readonly id!: string;

  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public addPosts!: BelongsToManyAddAssociationsMixin<Post, number>;
  public addPost!: BelongsToManyAddAssociationMixin<Post, number>;
  public removePosts!: BelongsToManyRemoveAssociationsMixin<Post, number>;
  public getPosts!: BelongsToManyGetAssociationsMixin<Post>;
}

HashTag.init(
  {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'HASH_TAG',
    modelName: 'HashTag',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associateHashTag = (db: DbType): void => {
  db.HashTag.hasMany(db.HashTagLog);
  db.HashTag.belongsToMany(db.Post, { through: 'POST_HASHTAG' });
};
export default HashTag;
