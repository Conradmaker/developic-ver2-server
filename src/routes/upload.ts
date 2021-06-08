import express from 'express';
import multer from 'multer';
import path from 'path';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import PostImage from '../db/models/postImage';
import MetaData from '../db/models/metaData';
import ExhibitionImage from '../db/models/exhibitionImage';

const uploadRouter = express.Router();

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
      cb(
        null,
        `original/post/${Date.now()}_${path.basename(file.originalname)}`
      );
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

const uploadThumb = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'developic2',
    key(req, file, cb) {
      cb(
        null,
        `original/thumbnail/${Date.now()}_${path.basename(file.originalname)}`
      );
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});
const uploadPoster = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'developic2',
    key(req, file, cb) {
      cb(
        null,
        `original/poster/${Date.now()}_${path.basename(file.originalname)}`
      );
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});
const uploadExhibition = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'developic2',
    key(req, file, cb) {
      cb(
        null,
        `original/exhibition/${Date.now()}_${path.basename(file.originalname)}`
      );
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});
uploadRouter.post(
  '/postimage/:userId',
  upload.single('image'),
  async (req, res, next) => {
    try {
      const splitedSrc = (req.file as Express.MulterS3.File).location.split(
        '/'
      );
      const newImage = await PostImage.create({
        src: `/${splitedSrc[4]}/${splitedSrc[5]}`,
        UserId: parseInt(req.params.userId),
        PostId: 1,
      });

      res.status(201).json({
        imageId: newImage.id,
        src: (req.file as Express.MulterS3.File).location.replace(
          '/original',
          '/resize/600'
        ),
      });
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
  const splitedSrc = (req.file as Express.MulterS3.File).location.split('/');
  res.status(201).send(`/${splitedSrc[4]}/${splitedSrc[5]}`);
});

uploadRouter.post(
  '/exhibitionimage/:userId',
  uploadExhibition.single('image'),
  async (req, res, next) => {
    try {
      const splitedSrc = (req.file as Express.MulterS3.File).location.split(
        '/'
      );
      const newImage = await ExhibitionImage.create({
        src: `/${splitedSrc[4]}/${splitedSrc[5]}`,
        UserId: parseInt(req.params.userId),
        ExhibitionId: 1,
      });
      res.status(201).json({
        imageId: newImage.id,
        src: (req.file as Express.MulterS3.File).location.replace(
          '/original',
          '/resize/600'
        ),
      });
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
);

uploadRouter.post('/poster', uploadPoster.single('image'), (req, res) => {
  const splitedSrc = (req.file as Express.MulterS3.File).location.split('/');
  res.status(201).send(`/${splitedSrc[4]}/${splitedSrc[5]}`);
});

export default uploadRouter;
