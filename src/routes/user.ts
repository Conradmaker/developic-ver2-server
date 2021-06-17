import express from 'express';
import {
  getUserDetailInfoController,
  updateUserIntroController,
  updateUserInfoController,
  updatePasswordController,
  destroyUserController,
  subscribeWriter,
  unSubscribeWriter,
  getSubscribeList,
  addLikePostController,
  removeLikePostController,
} from '../controllers/user';
import { isLoggedIn } from '../middlewares/isLoggedIn';

const userRouter = express.Router();

//NOTE: 유저 상세정보 불러오기
userRouter.get('/detail/:UserId', isLoggedIn, getUserDetailInfoController);

//NOTE: 유저 계정정보 수정
userRouter.patch('/info', isLoggedIn, updateUserInfoController);

//NOTE: 비밀번호 변경
userRouter.patch('/password', isLoggedIn, updatePasswordController);

//NOTE: 유저 소개 수정
userRouter.patch('/intro', isLoggedIn, updateUserIntroController);

//NOTE: 회원 탈퇴
userRouter.delete('/:UserId', isLoggedIn, destroyUserController);

//NOTE: 구독하기
userRouter.post('/subscribe/add', isLoggedIn, subscribeWriter);

//NOTE: 구독취소
userRouter.post('/subscribe/remove', isLoggedIn, unSubscribeWriter);

//NOTE: 구독작가 목록 조회
userRouter.get('/subscribe/:UserId', isLoggedIn, getSubscribeList);

//NOTE: 게시글 좋아요
userRouter.post('/like/post', isLoggedIn, addLikePostController);

//NOTE: 게시글 좋아요 취소
userRouter.patch('/like/post', isLoggedIn, removeLikePostController);

export default userRouter;
