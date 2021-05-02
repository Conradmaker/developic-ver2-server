import express from 'express';
import {
  getUserDetailInfoController,
  updateUserIntroController,
} from '../controllers/user';

const userRouter = express.Router();

userRouter.get('/detail/:UserId', getUserDetailInfoController);
userRouter.patch('/intro', updateUserIntroController);

export default userRouter;
