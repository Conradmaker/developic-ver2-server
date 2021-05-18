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
export type GetPhotoBinderListHandler = RequestHandler<
  { UserId: string },
  unknown | string,
  null,
  null
>;
export type GetPhotoBinderDetailHandler = RequestHandler<
  { BinderId: string },
  unknown | string,
  null,
  null
>;
export type CreatePhotoBinderHandler = RequestHandler<
  null,
  unknown | string,
  { title: string; description: string; UserId: number },
  null
>;
export type RemovePhotoBinderHandler = RequestHandler<
  { BinderId: string },
  unknown | string,
  null,
  null
>;
export type UpdatePhotoBinderDetailHandler = RequestHandler<
  { BinderId: string },
  unknown | string,
  { title: string; description: string; BinderId: number },
  null
>;
export type RemoveBinderPhotoHandler = RequestHandler<
  { BinderId: string },
  unknown | string,
  { photoIdArr: number[]; BinderId: number },
  null
>;
export type AddBinderPhotoHandler = RequestHandler<
  { BinderId: string },
  unknown | string,
  { photoIdArr: number[]; BinderId: number },
  null
>;
