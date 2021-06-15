import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import sequelize from './sequelize';

class Admin extends Model {
  public readonly id!: string;

  public email!: string;
  public password!: string;
  public name!: string;
  public nickname!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
Admin.init(
  {
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'ADMIN',
    modelName: 'Admin',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associateAdmin = (db: DbType): void => {
  db.Admin.hasMany(db.FaQ);
  db.Admin.hasMany(db.Notice);
};
export default Admin;
