import express from 'express';
import authRouter from './auth';
import listRouter from './list';
import uploadRouter from './upload';
import postRouter from './post';
import picstoryRouter from './picstory';
import blogRouter from './blog';
import userRouter from './user';
import drawerRouter from './drawer';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/list', listRouter);
router.use('/upload', uploadRouter);
router.use('/post', postRouter);
router.use('/picstory', picstoryRouter);
router.use('/blog', blogRouter);
router.use('/user', userRouter);
router.use('/drawer', drawerRouter);

export default router;
