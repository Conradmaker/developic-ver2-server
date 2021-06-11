import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import sequelize from './sequelize';

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
  db.RecentView.belongsTo(db.User, { onDelete: 'CASCADE' });
  db.RecentView.belongsTo(db.Post);
};
export default RecentView;
