import { DataTypes, Model } from 'sequelize';
import { DbType, sequelize } from './index';

class DeclarePost extends Model {
  public readonly id!: string;

  public reason!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DeclarePost.init(
  {
    reason: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'DECLARE_POST',
    modelName: 'declarePost',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associateDeclarePost = (db: DbType): void => {
  console.log(db);
};
export default DeclarePost;
