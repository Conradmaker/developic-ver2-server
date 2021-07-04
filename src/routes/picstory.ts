import express from 'express';
import {
  addPostPicstoryController,
  createPicstoryController,
  destroyPicstoryController,
  getUserPicstoryListController,
  removePostPicstoryController,
  updatePicstoryController,
} from '../controllers/picstory';

const picstoryRouter = express.Router();

picstoryRouter.post('/', createPicstoryController);
picstoryRouter.post('/post', addPostPicstoryController);
picstoryRouter.patch('/post', removePostPicstoryController);
picstoryRouter.delete('/:PicstoryId', destroyPicstoryController);
picstoryRouter.get('/:UserId', getUserPicstoryListController);
picstoryRouter.patch('/detail', updatePicstoryController);

export default picstoryRouter;
