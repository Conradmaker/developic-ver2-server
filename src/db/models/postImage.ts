import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import sequelize from './sequelize';

class PostImage extends Model {
  public readonly id!: string;

  public src!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PostImage.init(
  {
    src: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'POST_IMAGE',
    modelName: 'PostImage',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associatePostImage = (db: DbType): void => {
  db.PostImage.belongsTo(db.User, { onDelete: 'CASCADE' });
  db.PostImage.belongsTo(db.Post, { onDelete: 'CASCADE' });
  db.PostImage.hasOne(db.MetaData);
  db.PostImage.belongsToMany(db.PhotoBinder, { through: 'BINDER_IMAGE' });
};
export default PostImage;
