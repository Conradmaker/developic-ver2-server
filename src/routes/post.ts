import express from 'express';
import {
  addHashTagController,
  createCommentController,
  removePostController,
  getPhotoDetail,
  getPostDetail,
  getTempPost,
  preSaveController,
  removeCommentController,
  searchHashTagsController,
  submitPostController,
  updateCommentController,
} from '../controllers/post';
import { isLoggedIn } from '../middlewares/isLoggedIn';

const postRouter = express.Router();

//NOTE: 해시태그 생성
postRouter.post('/hashtag', isLoggedIn, addHashTagController);

//NOTE: 해시태그 목록 검색
postRouter.get('/hashtag', searchHashTagsController);

//NOTE: 임시저장
postRouter.post('/presave', isLoggedIn, preSaveController);

//NOTE: 게시글 등록
postRouter.post('/submit', isLoggedIn, submitPostController);

//NOTE: 임시저장된 게시글 불러오기
postRouter.get('/temp/:PostId', isLoggedIn, getTempPost);

//NOTE: 사진 상세정보 불어오기
postRouter.get('/photo/:PhotoId', getPhotoDetail);

//NOTE: 댓글 등록
postRouter.post('/comment', isLoggedIn, createCommentController);

//NOTE: 댓글 수정
postRouter.patch('/comment', isLoggedIn, updateCommentController);

//NOTE: 댓글 삭제
postRouter.delete('/comment/:CommentId', isLoggedIn, removeCommentController);

//NOTE: 게시글 상세정보 불러오기
postRouter.get('/:PostId', getPostDetail);

//NOTE: 게시글 삭제
postRouter.delete('/:PostId', isLoggedIn, removePostController);

export default postRouter;
