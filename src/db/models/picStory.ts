import { DataTypes, Model } from 'sequelize';
import { DbType, sequelize } from './index';

class PicStory extends Model {
  public readonly id!: string;

  public title!: string;
  public description!: string;
  public isPrivate!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PicStory.init(
  {
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    isPrivate: {
      type: DataTypes.TINYINT(),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'PIC_STORY',
    modelName: 'PicStory',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associatePicStory = (db: DbType): void => {
  console.log(db);
};
export default PicStory;
