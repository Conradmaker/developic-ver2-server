import express from 'express';
import {
  addHashTagController,
  preSaveController,
  searchHashTagsController,
  submitPostController,
} from '../controllers/post';

const postRouter = express.Router();

postRouter.post('/hashtag', addHashTagController);

postRouter.get('/hashtag', searchHashTagsController);

postRouter.post('/presave', preSaveController);

postRouter.post('/submit', submitPostController);

export default postRouter;
