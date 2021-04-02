import { DataTypes, Model } from 'sequelize';
import { DbType } from '.';
import sequelize from './sequelize';

class PhotoBinder extends Model {
  public readonly id!: string;

  public title!: string;
  public description!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PhotoBinder.init(
  {
    title: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'PHOTO_BINDER',
    modelName: 'PhotoBinder',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);
export const associatePhotoBinder = (db: DbType): void => {
  db.PhotoBinder.belongsTo(db.User);
  db.PhotoBinder.belongsToMany(db.PostImage, { through: 'BINDER_IMAGE' });
};
export default PhotoBinder;
