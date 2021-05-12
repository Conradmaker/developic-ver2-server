import express from 'express';
import {
  addHashTagController,
  getPhotoDetail,
  getPostDetail,
  getTempPost,
  preSaveController,
  searchHashTagsController,
  submitPostController,
} from '../controllers/post';

const postRouter = express.Router();

postRouter.post('/hashtag', addHashTagController);

postRouter.get('/hashtag', searchHashTagsController);

postRouter.post('/presave', preSaveController);

postRouter.post('/submit', submitPostController);

postRouter.get('/temp/:PostId', getTempPost);

postRouter.get('/photo/:PhotoId', getPhotoDetail);

postRouter.get('/:PostId', getPostDetail);

export default postRouter;
