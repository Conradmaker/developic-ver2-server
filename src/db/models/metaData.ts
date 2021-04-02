import { DataTypes, Model } from 'sequelize';
import { DbType, sequelize } from './index';

class MetaData extends Model {
  public readonly id!: string;

  public manufacturer?: string; //제조사
  public model?: string; //모델명
  public fValue?: string; //f값
  public resolutionX?: string; //가로해상도
  public resolutionY?: string; //가로해상도
  public location?: string; //위치
  public exposureTime?: string; //노출시간
  public size?: string; //크기
  public shutterSpeed?: string; //셔터스피드
  public ISO?: string; //iso속도 등급

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MetaData.init(
  {
    manufacturer: {
      type: DataTypes.STRING(128),
    },
    model: {
      type: DataTypes.STRING(128),
    },
    fValue: {
      type: DataTypes.STRING(128),
    },
    resolutionX: {
      type: DataTypes.INTEGER(),
    },
    resolutionY: {
      type: DataTypes.INTEGER(),
    },
    location: {
      type: DataTypes.STRING(128),
    },
    exposureTime: {
      type: DataTypes.STRING(128),
    },
    size: {
      type: DataTypes.STRING(128),
    },
    shutterSpeed: {
      type: DataTypes.STRING(128),
    },
    ISO: {
      type: DataTypes.INTEGER(),
    },
  },
  {
    sequelize,
    tableName: 'META_DATA',
    modelName: 'MetaData',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associateMetaData = (db: DbType): void => {
  console.log(db);
};
export default MetaData;
