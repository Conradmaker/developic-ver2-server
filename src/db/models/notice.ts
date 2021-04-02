import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import sequelize from './sequelize';

class Notice extends Model {
  public readonly id!: string;

  public title!: string;
  public content!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Notice.init(
  {
    title: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT(),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'NOTICE',
    modelName: 'Notice',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associateNotice = (db: DbType): void => {
  db.Notice.belongsTo(db.Admin);
};
export default Notice;
