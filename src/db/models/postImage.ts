import { DataTypes, Model } from 'sequelize';
import { DbType, sequelize } from './index';

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
  console.log(db);
};
export default PostImage;
