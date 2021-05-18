import express from 'express';
import {
  getUserDetailInfoController,
  updateUserIntroController,
  updateUserInfoController,
  updatePasswordController,
  destroyUserController,
  subscribeWriter,
  unSubscribeWriter,
  getSubscribeList,
  addLikePostController,
  removeLikePostController,
} from '../controllers/user';

const userRouter = express.Router();

userRouter.get('/detail/:UserId', getUserDetailInfoController);
userRouter.patch('/info', updateUserInfoController);
userRouter.patch('/password', updatePasswordController);
userRouter.patch('/intro', updateUserIntroController);
userRouter.delete('/:UserId', destroyUserController);
userRouter.post('/subscribe/add', subscribeWriter);
userRouter.post('/subscribe/remove', unSubscribeWriter);
userRouter.get('/subscribe/:UserId', getSubscribeList);
userRouter.post('/like/post', addLikePostController);
userRouter.patch('/like/post', removeLikePostController);

export default userRouter;
