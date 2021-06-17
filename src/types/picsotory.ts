import { RequestHandler } from 'express';
import PicStory from '../db/models/picStory';

export type CreatePicstoryHandler = RequestHandler<
  unknown,
  { id: string; title: string } | string,
  { title: string; thumbnail: string; description: string; UserId: string },
  Record<string, any>
>;

export type AddPostPicstoryHandler = RequestHandler<
  unknown,
  { id: string } | string,
  { PostId: string; PicstoryId: string },
  Record<string, any>
>;

export type RemovePostPicstoryHandler = RequestHandler<
  unknown,
  { id: string } | string,
  { PostId: string; PicstoryId: string },
  Record<string, any>
>;

export type DestroyPicstoryHandler = RequestHandler<
  { PicstoryId: string },
  { id: number } | string,
  Record<string, any>
>;

export type GetUserPicstoryListHandler = RequestHandler<
  { UserId: string },
  PicStory[] | string,
  null,
  null
>;
