import { DataTypes, Model } from 'sequelize';
import { DbType, sequelize } from './index';

class RecentView extends Model {
  public readonly id!: string;

  public date!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RecentView.init(
  {
    date: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: new Date(),
    },
  },
  {
    sequelize,
    tableName: 'RECENT_VIEW',
    modelName: 'RecentView',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associateRecentView = (db: DbType): void => {
  console.log(db);
};
export default RecentView;
