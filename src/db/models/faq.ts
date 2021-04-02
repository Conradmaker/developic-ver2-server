import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import sequelize from './sequelize';

class FaQ extends Model {
  public readonly id!: string;

  public question!: string;
  public answer!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FaQ.init(
  {
    question: {
      type: DataTypes.STRING(512),
      allowNull: false,
    },
    answer: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'FAQ',
    modelName: 'FaQ',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associateFaQ = (db: DbType): void => {
  db.FaQ.belongsTo(db.Admin);
};
export default FaQ;
