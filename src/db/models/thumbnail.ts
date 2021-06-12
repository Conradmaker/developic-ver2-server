import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import sequelize from './sequelize';

class Thumbnail extends Model {
  public readonly id!: string;

  public src!: string;
  public type!: 'poster' | 'thumbnail' | 'avatar';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Thumbnail.init(
  {
    src: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(58),
      allowNull: false,
      defaultValue: 'thumbnail',
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
