import express from 'express';
import authRouter from './auth';
import listRouter from './list';
import uploadRouter from './upload';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/list', listRouter);
router.use('/upload', uploadRouter);

export default router;
