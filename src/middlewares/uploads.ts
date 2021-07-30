import multer from 'multer';
import path from 'path';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import cryptoRandomString from 'crypto-random-string';

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
});

//NOTE: 포스트 사진 업로드
export const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'developic2',
    key(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(
        null,
        `original/post/${Date.now()}_${cryptoRandomString({ length: 5 }) + ext}`
      );
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

//NOTE: 썸내일 업로드
export const uploadThumb = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'developic2',
    key(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(
        null,
        `original/thumbnail/${Date.now()}_${
          cryptoRandomString({ length: 5 }) + ext
        }`
      );
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

//NOTE: 전시회 포스터 업로드
export const uploadPoster = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'developic2',
    key(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(
        null,
        `original/poster/${Date.now()}_${
          cryptoRandomString({ length: 5 }) + ext
        }`
      );
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

//NOTE: 전시회 사진 업로드
export const uploadExhibition = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'developic2',
    key(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(
        null,
        `original/exhibition/${Date.now()}_${
          cryptoRandomString({ length: 5 }) + ext
        }`
      );
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

//NOTE: 유저 아바타 업로드
export const uploadAvatar = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'developic2',
    key(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(
        null,
        `original/avatar/${Date.now()}_${
          cryptoRandomString({ length: 5 }) + ext
        }`
      );
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});
