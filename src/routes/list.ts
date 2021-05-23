import express from 'express';
import {
  getExhibitionList,
  getFeedList,
  getHashTaggedPostController,
  getHashTagList,
  getPostList,
  getWriterList,
} from '../controllers/list';

const listRouter = express.Router();

listRouter.get('/writer', getWriterList);
listRouter.get('/feed/:UserId', getFeedList);
listRouter.get('/post', getPostList);
listRouter.get('/tag', getHashTagList);
listRouter.get('/post/tag/:HashTagId', getHashTaggedPostController);
listRouter.get('/exhibition', getExhibitionList);

export default listRouter;
