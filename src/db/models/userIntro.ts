import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import sequelize from './sequelize';

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
    },
    website: {
      type: DataTypes.STRING(40),
    },
    mostlyUseModel: {
      type: DataTypes.STRING(128),
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
  db.UserIntro.belongsTo(db.User);
};
export default UserIntro;
