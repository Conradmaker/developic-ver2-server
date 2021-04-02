import { DataTypes, Model } from 'sequelize';
import { DbType, sequelize } from './index';

class UserIntro extends Model {
  public readonly id!: string;

  public introduction!: string;
  public website?: string;
  public mostlyUseModel?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserIntro.init(
  {
    introduction: {
      type: DataTypes.TEXT(),
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING(40),
    },
    mostlyUseModel: {
      type: DataTypes.STRING(50),
    },
  },
  {
    sequelize,
    tableName: 'USER_INTRO',
    modelName: 'UserIntro',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associateUserIntro = (db: DbType): void => {
  console.log(db);
};
export default UserIntro;
