import express from 'express';
import {
  addPostPicstoryController,
  createPicstoryController,
  destroyPicstoryController,
  getUserPicstoryListController,
  removePostPicstoryController,
  updatePicstoryController,
} from '../controllers/picstory';
import { isLoggedIn } from '../middlewares/isLoggedIn';

const picstoryRouter = express.Router();

//NOTE: 새 픽스토리 생성
picstoryRouter.post('/', isLoggedIn, createPicstoryController);
//NOTE: 픽스토리에 게시글 추가
picstoryRouter.post('/post', isLoggedIn, addPostPicstoryController);
//NOTE: 픽스토리에서 게시글 삭제
picstoryRouter.patch('/post', isLoggedIn, removePostPicstoryController);
//NOTE: 픽스토리 삭제
picstoryRouter.delete('/:PicstoryId', isLoggedIn, destroyPicstoryController);
//NOTE: 픽스토리 목록 조회
picstoryRouter.get('/:UserId', getUserPicstoryListController);
picstoryRouter.patch('/detail', updatePicstoryController);

export default picstoryRouter;
