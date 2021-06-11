import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import sequelize from './sequelize';

class DeclareComment extends Model {
  public readonly id!: string;

  public reason!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DeclareComment.init(
  {
    reason: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'DECLARE_COMMENT',
    modelName: 'DeclareComment',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associateDeclareComment = (db: DbType): void => {
  db.DeclareComment.belongsTo(db.User, { onDelete: 'CASCADE' });
  db.DeclareComment.belongsTo(db.Comment, { onDelete: 'CASCADE' });
};
export default DeclareComment;
