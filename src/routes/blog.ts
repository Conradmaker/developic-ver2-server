import express from 'express';
import {
  getBloggerInfoController,
  getBloggerPicPostListController,
  getBloggerPicstoryListController,
  getBloggerPostListController,
} from '../controllers/blog';

const blogRouter = express.Router();

//NOTE: 블로그주인 정보 조회
blogRouter.get('/user/:UserId', getBloggerInfoController);

//NOTE: 블로그 포스트 조회
blogRouter.get('/post/:UserId', getBloggerPostListController);

//NOTE: 블로그 픽스토리 조회
blogRouter.get('/picstory/:UserId', getBloggerPicstoryListController);

//NOTE: 블로그 픽스토리 상세정보 조회
blogRouter.get('/picpost/:PicstoryId', getBloggerPicPostListController);

export default blogRouter;
