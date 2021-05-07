import { RequestHandler } from 'express';

// 파라미터 , 응답바디 , 요청바디, 쿼리
export type GetLikesListHandler = RequestHandler<
  { UserId: string },
  unknown | string,
  null,
  null
>;
export type RemoveLikesItemHandler = RequestHandler<
  { UserId: string },
  unknown | string,
  null,
  { PostId: string }
>;
export type GetTempListHandler = RequestHandler<
  { UserId: string },
  unknown | string,
  null,
  null
>;
export type RemoveTempPostHandler = RequestHandler<
  { PostId: string },
  unknown | string,
  null,
  null
>;
export type GetRecentViewsHandler = RequestHandler<
  { UserId: string },
  unknown | string,
  null,
  null
>;
export type RemoveRecentViewHandler = RequestHandler<
  { RecentId: string },
  { recentId: number } | string,
  null,
  null
>;
