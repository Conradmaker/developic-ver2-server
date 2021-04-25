import { RequestHandler } from 'express';

// 파라미터 , 응답바디 , 요청바디, 쿼리
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
