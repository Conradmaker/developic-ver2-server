import express from 'express';
import {
  getBloggerInfoController,
  getBloggerPicPostListController,
  getBloggerPicstoryListController,
  getBloggerPostListController,
} from '../controllers/blog';

const blogRouter = express.Router();

blogRouter.get('/user/:UserId', getBloggerInfoController);
blogRouter.get('/post/:UserId', getBloggerPostListController);
blogRouter.get('/picstory/:UserId', getBloggerPicstoryListController);
blogRouter.get('/picpost/:PicstoryId', getBloggerPicPostListController);

export default blogRouter;
