import { DataTypes, Model } from 'sequelize';
import { DbType, sequelize } from './';

class User extends Model {
  public readonly userId!: string;
  public email!: string;
  public password!: string;
  public name!: string;
  public nickname!: string;
  public state!: number;
  public loginType!: 'local' | 'kakao' | 'google' | 'facebook';
  public socialToken!: string;
  public lastLogin!: string;
  public introduce?: string;
  public birth?: string;
  public gender?: string;
  public avatar?: string;
  public verificationCode!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    userId: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(100),
    },
    password: {
      type: DataTypes.STRING(100),
    },
    name: {
      type: DataTypes.STRING(30),
    },
    nickname: {
      type: DataTypes.STRING(30),
    },
    state: {
      type: DataTypes.TINYINT(),
      allowNull: false,
      defaultValue: 0,
    },
    loginType: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'local',
    },
    socialToken: {
      type: DataTypes.STRING(50),
    },
    gender: {
      type: DataTypes.STRING(10),
    },
    birth: {
      type: DataTypes.STRING(20),
    },
    introduce: {
      type: DataTypes.STRING(256),
    },
    avatar: {
      type: DataTypes.STRING(50),
    },
    verificationCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: '1',
    },
    lastLogin: {
      type: DataTypes.STRING(20),
    },
  },
  {
    sequelize,
    tableName: 'USER',
    modelName: 'User',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);

export const associateUser = (db: DbType): void => {
  console.log(db);
};
export default User;
