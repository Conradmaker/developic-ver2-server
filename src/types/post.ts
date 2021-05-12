import { RequestHandler } from 'express';

export type GetPostDetailHandler = RequestHandler<
  { PostId: string },
  string | unknown,
  null,
  null
>;

export type GetPhotoDetailHandler = RequestHandler<
  { PhotoId: string },
  string | unknown,
  null,
  null
>;
