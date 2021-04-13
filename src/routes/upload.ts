import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import PostImage from '../db/models/postImage';
const uploadRouter = express.Router();
try {
  fs.accessSync(path.join('src', 'uploads', 'post'));
} catch (e) {
  console.log('폴더가 없어서 생성합니다.');
  fs.mkdirSync(path.join('src', 'uploads'));
  fs.mkdirSync(path.join('src', 'uploads', 'post'));
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, res, done) {
      done(null, 'src/uploads/post');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      done(null, basename + new Date().getTime() + ext);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

uploadRouter.post(
  '/postimage/:userId',
  upload.single('image'),
  async (req, res, next) => {
    try {
      console.dir(req.params);
      const newImage = await PostImage.create({
        src: req.file.filename,
        UserId: parseInt(req.params.userId),
        PostId: 1,
      });

      res.status(201).json({ imageId: newImage.id, src: newImage.src });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
);

export default uploadRouter;
