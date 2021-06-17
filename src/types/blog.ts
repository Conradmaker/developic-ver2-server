import { RequestHandler } from 'express';

export type GetBloggerInfoHandler = RequestHandler<
  { UserId: string },
  unknown | string,
  null,
  null
>;
export type GetBloggerPostListHandler = RequestHandler<
  { UserId: string },
  unknown | string,
  null,
  { limit: string; offset: string }
>;
export type GetBloggerPicstoryListHandler = RequestHandler<
  { UserId: string },
  unknown | string,
  null,
  { limit: string; offset: string }
>;
export type GetBloggerPicPostListHandler = RequestHandler<
  { PicstoryId: string },
  unknown | string,
  null,
  { limit: string; offset: string }
>;
