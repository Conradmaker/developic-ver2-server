import express from 'express';
import {
  getLikesListCtr,
  getTempListCtr,
  removeLikesItemCtr,
  removeTempPostCtr,
  getRecentViewsCtr,
  removeRecentViewCtr,
  getBinderListCtr,
  getBinderDetailCtr,
  updateBinderDetailCtr,
  removeBinderPhotoCtr,
  removeBinderCtr,
  addBinderPhotoCtr,
  createBinderCtr,
} from '../controllers/drawer';
import { isLoggedIn } from '../middlewares/isLoggedIn';

const drawerRouter = express.Router();

//NOTE: 좋아요 게시글 목록 조회
drawerRouter.get('/likes/:UserId', isLoggedIn, getLikesListCtr);
//NOTE: 좋아요 항목 삭제
drawerRouter.delete('/likes/:UserId', isLoggedIn, removeLikesItemCtr);

//NOTE: 임시저장 게시글 목록 조회
drawerRouter.get('/saves/:UserId', isLoggedIn, getTempListCtr);
//NOTE: 임시저장 게시글 삭제
drawerRouter.delete('/saves/:PostId', isLoggedIn, removeTempPostCtr);

//NOTE: 최근 본 글 목록 조회
drawerRouter.get('/recents/:UserId', isLoggedIn, getRecentViewsCtr);
//NOTE: 최근 본 글 삭제
drawerRouter.delete('/recents/:RecentId', isLoggedIn, removeRecentViewCtr);

//NOTE: 포토바인더 목록 조회
drawerRouter.get('/binder/:UserId', isLoggedIn, getBinderListCtr);
//NOTE: 포토바인더 생성
drawerRouter.post('/binder', isLoggedIn, createBinderCtr);
//NOTE: 포토바인더 삭제
drawerRouter.delete('/binder/:BinderId', isLoggedIn, removeBinderCtr);
//NOTE: 포토바인더 수정
drawerRouter.patch('/binder/detail', isLoggedIn, updateBinderDetailCtr);
//NOTE: 포토바인더 안의 사진정보 및 디테일 불러오기
drawerRouter.get('/binder/detail/:BinderId', isLoggedIn, getBinderDetailCtr);
//NOTE: 포토바인더에 사진 추가
drawerRouter.post('/binder/photo', isLoggedIn, addBinderPhotoCtr);
//NOTE: 포토바인더에서 사진 삭제
drawerRouter.patch('/binder/photo', isLoggedIn, removeBinderPhotoCtr);

export default drawerRouter;
