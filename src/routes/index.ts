import express from 'express';
import authRouter from './auth';
import listRouter from './list';
import uploadRouter from './upload';
import postRouter from './post';
import picstoryRouter from './picstory';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/list', listRouter);
router.use('/upload', uploadRouter);
router.use('/post', postRouter);
router.use('/picstory', picstoryRouter);

export default router;
