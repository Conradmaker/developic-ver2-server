import express from 'express';
import {
  getExhibitionList,
  getFeedList,
  getHashTaggedPostController,
  getHashTagList,
  getPostList,
  getSearchedListController,
  getWriterList,
} from '../controllers/list';

const listRouter = express.Router();

//NOTE: 작가 최근활동 순 조회
listRouter.get('/writer', getWriterList);

//NOTE: 피드목록 조회
listRouter.get('/feed/:UserId', getFeedList);

//NOTE: 게시글 리스트 조회
listRouter.get('/post', getPostList);

//NOTE: 해시태그 리스트 조회
listRouter.get('/tag', getHashTagList);

//NOTE: 해시태그에 해당하는 게시글목록 조회
listRouter.get('/post/tag/:HashTagId', getHashTaggedPostController);

//NOTE: 전시회 목록 조회
listRouter.get('/exhibition', getExhibitionList);

//NOTE: 검색
listRouter.get('/search', getSearchedListController);

export default listRouter;
