import { DataTypes, Model } from 'sequelize';
import { DbType, sequelize } from './index';

class Thumbnail extends Model {
  public readonly id!: string;

  public src!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Thumbnail.init(
  {
    src: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'THUMBNAIL',
    modelName: 'Thumbnail',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associateThumbnail = (db: DbType): void => {
  console.log(db);
};
export default Thumbnail;
