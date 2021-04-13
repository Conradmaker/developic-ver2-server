import express from 'express';
import {
  getExhibitionList,
  getPostList,
  getWriterList,
} from '../controllers/list';

const listRouter = express.Router();

listRouter.get('/writer', getWriterList);
listRouter.get('/post', getPostList);
listRouter.get('/exhibition', getExhibitionList);

export default listRouter;
