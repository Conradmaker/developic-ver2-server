import { DataTypes, Model } from 'sequelize';
import { DbType, sequelize } from './index';

class ExhibitionImage extends Model {
  public readonly id!: string;

  public src!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ExhibitionImage.init(
  {
    src: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'EXHIBITION_IMAGE',
    modelName: 'ExhibitionImage',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associateExhibitionImage = (db: DbType): void => {
  console.log(db);
};
export default ExhibitionImage;
