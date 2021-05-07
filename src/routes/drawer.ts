import express from 'express';
import {
  getLikesListController,
  getTempListController,
  removeLikesItemController,
  removeTempPostController,
  getRecentViewsController,
  removeRecentViewController,
  getPhotoBinderListController,
  getPhotoBinderDetailController,
  updatePhotoBinderDetailController,
} from '../controllers/drawer';

const drawerRouter = express.Router();

drawerRouter.get('/likes/:UserId', getLikesListController);
drawerRouter.delete('/likes/:UserId', removeLikesItemController);
drawerRouter.get('/saves/:UserId', getTempListController);
drawerRouter.delete('/saves/:PostId', removeTempPostController);
drawerRouter.get('/recents/:UserId', getRecentViewsController);
drawerRouter.delete('/recents/:RecentId', removeRecentViewController);

drawerRouter.get('/binder/:UserId', getPhotoBinderListController);
drawerRouter.patch('/binder/detail', updatePhotoBinderDetailController);
drawerRouter.get('/binder/detail/:BinderId', getPhotoBinderDetailController);

export default drawerRouter;
