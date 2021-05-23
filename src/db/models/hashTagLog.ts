import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import HashTag from './hashtag';
import sequelize from './sequelize';

class HashTagLog extends Model {
  public readonly id!: string;

  public date!: string;
  public score!: 1 | 2;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public HashTag?: HashTag;
}

HashTagLog.init(
  {
    date: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: new Date(),
    },
    score: {
      type: DataTypes.TINYINT(),
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    tableName: 'HASH_TAG_LOG',
    modelName: 'HashTagsLog',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associateHashTagLog = (db: DbType): void => {
  db.HashTagLog.belongsTo(db.HashTag);
};
export default HashTagLog;
