import express from 'express';
import {
  getUserDetailInfoController,
  updateUserIntroController,
  updateUserInfoController,
  updatePasswordController,
  destroyUserController,
} from '../controllers/user';

const userRouter = express.Router();

userRouter.get('/detail/:UserId', getUserDetailInfoController);
userRouter.patch('/info', updateUserInfoController);
userRouter.patch('/password', updatePasswordController);
userRouter.patch('/intro', updateUserIntroController);
userRouter.delete('/:UserId', destroyUserController);

export default userRouter;
