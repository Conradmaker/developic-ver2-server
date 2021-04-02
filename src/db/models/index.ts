import Admin, { associateAdmin } from './admin';
import Comment, { associateComment } from './comment';
import DeclareComment, { associateDeclareComment } from './declareComment';
import DeclarePost, { associateDeclarePost } from './declarePost';
import Exhibition, { associateExhibition } from './exhibition';
import ExhibitionImage, { associateExhibitionImage } from './exhibitionImage';
import FaQ, { associateFaQ } from './faq';
import HashTag, { associateHashTag } from './hashtag';
import HashTagLog, { associateHashTagLog } from './hashTagLog';
import MetaData, { associateMetaData } from './metaData';
import Notice, { associateNotice } from './notice';
import PhotoBinder, { associatePhotoBinder } from './photoBinder';
import PicStory, { associatePicStory } from './picStory';
import Post, { associatePost } from './post';
import PostImage, { associatePostImage } from './postImage';
import PostLog, { associatePostLog } from './postLog';
import RecentView, { associateRecentView } from './recentView';
import Thumbnail, { associateThumbnail } from './thumbnail';
import User, { associateUser } from './user';
import UserIntro, { associateUserIntro } from './userIntro';

export * from './sequelize';

const db = {
  User,
  UserIntro,
  Thumbnail,
  RecentView,
  PostLog,
  PostImage,
  Post,
  PicStory,
  PhotoBinder,
  Notice,
  MetaData,
  HashTagLog,
  HashTag,
  FaQ,
  ExhibitionImage,
  Exhibition,
  DeclareComment,
  DeclarePost,
  Comment,
  Admin,
};
export type DbType = typeof db;

associateUser(db);
associateUserIntro(db);
associateThumbnail(db);
associateRecentView(db);
associatePostLog(db);
associatePostImage(db);
associatePost(db);
associatePicStory(db);
associatePhotoBinder(db);
associateNotice(db);
associateMetaData(db);
associateHashTagLog(db);
associateHashTag(db);
associateFaQ(db);
associateExhibition(db);
associateExhibitionImage(db);
associateDeclareComment(db);
associateDeclarePost(db);
associateAdmin(db);
associateComment(db);
