import { DataTypes, Model } from 'sequelize';
import { DbType, sequelize } from './index';

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
      type: DataTypes.TEXT(),
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT(),
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
  console.log(db);
};
export default FaQ;
