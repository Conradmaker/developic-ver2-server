import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import sequelize from './sequelize';

class Exhibition extends Model {
  public readonly id!: string;

  public cost!: number;
  public webPage?: string;
  public contact!: string;
  public email!: string;
  public title!: string;
  public author!: string;
  public address!: string;
  public description!: string;
  public isAllow!: boolean;
  public startDate!: string;
  public endDate!: string;
  public poster!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Exhibition.init(
  {
    cost: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      defaultValue: 0,
    },
    webPage: {
      type: DataTypes.STRING(128),
    },
    contact: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT(),
      allowNull: false,
    },
    isAllow: {
      type: DataTypes.TINYINT(),
      allowNull: false,
      defaultValue: 0,
    },
    startDate: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    endDate: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    poster: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'EXHIBITIONS',
    modelName: 'Exhibition',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associateExhibition = (db: DbType): void => {
  db.Exhibition.belongsTo(db.User, { onDelete: 'CASCADE' });
  db.Exhibition.hasMany(db.ExhibitionImage);
};
export default Exhibition;
