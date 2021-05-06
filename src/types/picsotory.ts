import { RequestHandler } from 'express';
import PicStory from '../db/models/picStory';
// 파라미터 , 응답바디 , 요청바디, 쿼리
export type CreatePicstoryHandler = RequestHandler<
  null,
  { id: string; title: string } | string,
  { title: string; thumbnail: string; description: string; UserId: string },
  null
>;

export type AddPostPicstoryHandler = RequestHandler<
  null,
  { id: string } | string,
  { PostId: string; PicstoryId: string },
  null
>;

export type RemovePostPicstoryHandler = RequestHandler<
  null,
  { id: string } | string,
  { PostId: string; PicstoryId: string },
  null
>;

export type DestroyPicstoryHandler = RequestHandler<
  { PicstoryId: string },
  { id: number } | string,
  null,
  null
>;

export type GetUserPicstoryListHandler = RequestHandler<
  { UserId: string },
  PicStory[] | string,
  null,
  null
>;
