import express from 'express';
import PostImage from '../db/models/postImage';
import MetaData from '../db/models/metaData';
import ExhibitionImage from '../db/models/exhibitionImage';
import Thumbnail from '../db/models/thumbnail';
import {
  upload,
  uploadAvatar,
  uploadExhibition,
  uploadPoster,
  uploadThumb,
} from '../middlewares/uploads';

const uploadRouter = express.Router();

//NOTE: 포스트 사진 업로드
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

//NOTE: 이미지 메타데이터 업로드
uploadRouter.post('/exif', async (req, res, next) => {
  try {
    const metaData = await MetaData.create(req.body);
    res.status(201).json(metaData);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

//NOTE: 썸내일 업로드
uploadRouter.post(
  '/thumbnail',
  uploadThumb.single('image'),
  async (req, res, next) => {
    try {
      const splitedSrc = (req.file as Express.MulterS3.File).location.split(
        '/'
      );
      await Thumbnail.create({
        src: `/${splitedSrc[4]}/${splitedSrc[5]}`,
        type: 'thumbnail',
      });
      res.status(201).send(`/${splitedSrc[4]}/${splitedSrc[5]}`);
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
);

//NOTE: 전시회 사진 업로드
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

//NOTE: 전시회 포스터 업로드
uploadRouter.post(
  '/poster',
  uploadPoster.single('image'),
  async (req, res, next) => {
    try {
      const splitedSrc = (req.file as Express.MulterS3.File).location.split(
        '/'
      );
      await Thumbnail.create({
        src: `/${splitedSrc[4]}/${splitedSrc[5]}`,
        type: 'poster',
      });
      res.status(201).send(`/${splitedSrc[4]}/${splitedSrc[5]}`);
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
);

//NOTE: 유저 아바타 업로드
uploadRouter.post(
  '/avatar',
  uploadAvatar.single('image'),
  async (req, res, next) => {
    try {
      const splitedSrc = (req.file as Express.MulterS3.File).location.split(
        '/'
      );
      await Thumbnail.create({
        src: `/${splitedSrc[4]}/${splitedSrc[5]}`,
        type: 'avatar',
      });
      res
        .status(201)
        .send(
          (req.file as Express.MulterS3.File).location.replace(
            '/original',
            '/resize/400'
          )
        );
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
);

export default uploadRouter;
