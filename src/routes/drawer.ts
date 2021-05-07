import express from 'express';
import {
  getLikesListController,
  getTempListController,
  removeLikesItemController,
  removeTempPostController,
  getRecentViewsController,
  removeRecentViewController,
} from '../controllers/drawer';

const drawerRouter = express.Router();

drawerRouter.get('/likes/:UserId', getLikesListController);
drawerRouter.delete('/likes/:UserId', removeLikesItemController);
drawerRouter.get('/saves/:UserId', getTempListController);
drawerRouter.delete('/saves/:PostId', removeTempPostController);
drawerRouter.get('/recents/:UserId', getRecentViewsController);
drawerRouter.delete('/recents/:RecentId', removeRecentViewController);

export default drawerRouter;
