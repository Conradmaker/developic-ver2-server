import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import PostImage from '../db/models/postImage';
import MetaData from '../db/models/metaData';
import ExhibitionImage from '../db/models/exhibitionImage';
const uploadRouter = express.Router();
try {
  fs.accessSync(path.join('src', 'uploads', 'post'));
} catch (e) {
  console.log('폴더가 없어서 생성합니다.');
  fs.mkdirSync(path.join('src', 'uploads'));
  fs.mkdirSync(path.join('src', 'uploads', 'post'));
}
try {
  fs.accessSync(path.join('src', 'uploads', 'thumbnail'));
} catch (e) {
  console.log('폴더가 없어서 생성합니다.');
  fs.mkdirSync(path.join('src', 'uploads', 'thumbnail'));
}
try {
  fs.accessSync(path.join('src', 'uploads', 'exhibition'));
} catch (e) {
  console.log('폴더가 없어서 생성합니다.');
  fs.mkdirSync(path.join('src', 'uploads', 'exhibition'));
}
try {
  fs.accessSync(path.join('src', 'uploads', 'poster'));
} catch (e) {
  console.log('폴더가 없어서 생성합니다.');
  fs.mkdirSync(path.join('src', 'uploads', 'poster'));
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
const uploadThumb = multer({
  storage: multer.diskStorage({
    destination(req, res, done) {
      done(null, 'src/uploads/thumbnail');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      done(null, basename + new Date().getTime() + ext);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});
const uploadExhibition = multer({
  storage: multer.diskStorage({
    destination(req, res, done) {
      done(null, 'src/uploads/exhibition');
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
        src: `http://localhost:8000/image/post/${req.file.filename}`,
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
uploadRouter.post('/exif', async (req, res, next) => {
  try {
    const metaData = await MetaData.create(req.body);
    res.status(201).json(metaData);
  } catch (e) {
    console.error(e);
    next(e);
  }
});
uploadRouter.post('/thumbnail', uploadThumb.single('image'), (req, res) => {
  res
    .status(201)
    .send(`http://localhost:8000/image/thumbnail/${req.file.filename}`);
});

uploadRouter.post(
  '/exhibitionimage/:userId',
  uploadExhibition.single('image'),
  async (req, res, next) => {
    try {
      console.dir(req.params);
      const newImage = await ExhibitionImage.create({
        src: `http://localhost:8000/image/exhibition/${req.file.filename}`,
        UserId: parseInt(req.params.userId),
        ExhibitionId: 1,
      });

      res.status(201).json({ imageId: newImage.id, src: newImage.src });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
);

uploadRouter.post('/poster', uploadThumb.single('image'), (req, res) => {
  res
    .status(201)
    .send(`http://localhost:8000/image/poster/${req.file.filename}`);
});
export default uploadRouter;
