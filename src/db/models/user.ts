import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  DataTypes,
  Model,
} from 'sequelize';
import { DbType } from '.';
import Post from './post';
import sequelize from './sequelize';

class User extends Model {
  public readonly id!: string;
  public email!: string;
  public password!: string;
  public name!: string;
  public nickname!: string;
  public state!: number;
  public loginType!: 'local' | 'kakao' | 'google' | 'facebook';
  public refreshToken?: string;
  public accessToken?: string;
  public socialId?: string;
  public lastLogin!: string;
  public introduce?: string;
  public birth?: string;
  public gender?: string;
  public avatar?: string;
  public verificationCode!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public addSubscriber!: BelongsToManyAddAssociationMixin<User, number>;
  public removeSubscriber!: BelongsToManyRemoveAssociationMixin<User, string>;
  public getSubscribers!: BelongsToManyGetAssociationsMixin<User>;

  public addWriter!: BelongsToManyAddAssociationMixin<User, number>;
  public removeWriter!: BelongsToManyRemoveAssociationMixin<User, string>;
  public getWriters!: BelongsToManyGetAssociationsMixin<User>;

  public addLikedPosts!: BelongsToManyAddAssociationMixin<Post, number>;
  public removeLikedPosts!: BelongsToManyRemoveAssociationMixin<Post, string>;
  public getLikedPosts!: BelongsToManyGetAssociationsMixin<Post>;
}

User.init(
  {
    email: {
      type: DataTypes.STRING(30),
    },
    password: {
      type: DataTypes.STRING(100),
    },
    name: {
      type: DataTypes.STRING(30),
    },
    nickname: {
      type: DataTypes.STRING(30),
    },
    state: {
      type: DataTypes.TINYINT(),
      allowNull: false,
      defaultValue: 0,
    },
    loginType: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'local',
    },
    refreshToken: {
      type: DataTypes.STRING(50),
    },
    accessToken: {
      type: DataTypes.STRING(50),
    },
    socialId: {
      type: DataTypes.STRING(50),
    },
    gender: {
      type: DataTypes.STRING(10),
    },
    birth: {
      type: DataTypes.STRING(20),
    },
    introduce: {
      type: DataTypes.STRING(256),
    },
    avatar: {
      type: DataTypes.STRING(128),
    },
    verificationCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: '1',
    },
    lastLogin: {
      type: DataTypes.STRING(20),
    },
  },
  {
    sequelize,
    tableName: 'USER',
    modelName: 'User',
    charset: 'utf8',
    collate: 'utf8_general_ci',
  }
);

export const associateUser = (db: DbType): void => {
  db.User.hasMany(db.PhotoBinder);
  db.User.hasMany(db.PostImage);
  db.User.hasMany(db.PicStory);
  db.User.hasMany(db.Comment);
  db.User.hasMany(db.DeclareComment);
  db.User.hasMany(db.DeclarePost);
  db.User.hasMany(db.RecentView);
  db.User.hasMany(db.Exhibition);
  db.User.hasMany(db.ExhibitionImage);
  db.User.hasOne(db.UserIntro);
  db.User.hasMany(db.Post);
  db.User.belongsToMany(db.User, {
    through: 'SUBSCRIBE',
    as: 'subscribers',
    foreignKey: 'SubscriberId',
  });
  db.User.belongsToMany(db.User, {
    through: 'SUBSCRIBE',
    as: 'writers',
    foreignKey: 'WriterId',
  });
  db.User.belongsToMany(db.Post, { through: 'POST_LIKE', as: 'likedPosts' });
  db.User.belongsToMany(db.Comment, {
    through: 'COMMENT_LIKE',
    as: 'likedComments',
  });
};
export default User;
