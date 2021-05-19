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

const postRouter = express.Router();

postRouter.post('/hashtag', addHashTagController);

postRouter.get('/hashtag', searchHashTagsController);

postRouter.post('/presave', preSaveController);

postRouter.post('/submit', submitPostController);

postRouter.get('/temp/:PostId', getTempPost);

postRouter.get('/photo/:PhotoId', getPhotoDetail);

postRouter.post('/comment', createCommentController);

postRouter.patch('/comment', updateCommentController);

postRouter.delete('/comment/:CommentId', removeCommentController);

postRouter.get('/:PostId', getPostDetail);

postRouter.delete('/:PostId', removePostController);

export default postRouter;
