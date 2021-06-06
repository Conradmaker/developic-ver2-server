import express from 'express';
import multer, { Multer } from 'multer';
import path from 'path';
import fs from 'fs';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
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
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
});

const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'developic2',
    key(req, file, cb) {
      cb(null, `post/${Date.now()}_${path.basename(file.originalname)}`);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

const uploadThumb = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'developic2',
    key(req, file, cb) {
      cb(null, `thumbnail/${Date.now()}_${path.basename(file.originalname)}`);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});
const uploadPoster = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'developic2',
    key(req, file, cb) {
      cb(null, `poster/${Date.now()}_${path.basename(file.originalname)}`);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});
const uploadExhibition = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'developic2',
    key(req, file, cb) {
      cb(null, `exhibition/${Date.now()}_${path.basename(file.originalname)}`);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});
uploadRouter.post(
  '/postimage/:userId',
  upload.single('image'),
  async (req, res, next) => {
    try {
      const newImage = await PostImage.create({
        src: (req.file as Express.MulterS3.File).location,
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
  res.status(201).send((req.file as Express.MulterS3.File).location);
});

uploadRouter.post(
  '/exhibitionimage/:userId',
  uploadExhibition.single('image'),
  async (req, res, next) => {
    try {
      console.dir(req.params);
      const newImage = await ExhibitionImage.create({
        src: (req.file as Express.MulterS3.File).location,
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

uploadRouter.post('/poster', uploadPoster.single('image'), (req, res) => {
  res.status(201).send((req.file as Express.MulterS3.File).location);
});

export default uploadRouter;
