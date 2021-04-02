import { DataTypes, Model } from 'sequelize';
import { DbType, sequelize } from './index';

class HashTag extends Model {
  public readonly id!: string;

  public name!: string;
  public hits!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

HashTag.init(
  {
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    hits: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'HASH_TAG',
    modelName: 'HashTag',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associateHashTag = (db: DbType): void => {
  console.log(db);
};
export default HashTag;
