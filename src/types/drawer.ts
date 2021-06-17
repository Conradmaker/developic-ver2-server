import { RequestHandler } from 'express';

export type GetLikesListHandler = RequestHandler<
  { UserId: string },
  unknown | string,
  null,
  { limit?: string; offset?: string }
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
  { limit?: string; offset?: string }
>;
export type RemoveTempPostHandler = RequestHandler<
  { PostId: string },
  unknown | string,
  null,
  Record<string, any>
>;
export type GetRecentViewsHandler = RequestHandler<
  { UserId: string },
  unknown | string,
  null,
  { limit?: string; offset?: string }
>;
export type RemoveRecentViewHandler = RequestHandler<
  { RecentId: string },
  { recentId: number } | string,
  null,
  Record<string, any>
>;
export type GetPhotoBinderListHandler = RequestHandler<
  { UserId: string },
  unknown | string,
  null,
  { limit?: string; offset?: string }
>;
export type GetPhotoBinderDetailHandler = RequestHandler<
  { BinderId: string },
  unknown | string,
  null,
  Record<string, any>
>;
export type CreatePhotoBinderHandler = RequestHandler<
  unknown,
  unknown | string,
  { title: string; description: string; UserId: number },
  Record<string, any>
>;
export type RemovePhotoBinderHandler = RequestHandler<
  { BinderId: string },
  unknown | string,
  null,
  Record<string, any>
>;
export type UpdatePhotoBinderDetailHandler = RequestHandler<
  { BinderId: string },
  unknown | string,
  { title: string; description: string; BinderId: number },
  Record<string, any>
>;
export type RemoveBinderPhotoHandler = RequestHandler<
  { BinderId: string },
  unknown | string,
  { photoIdArr: number[]; BinderId: number },
  Record<string, any>
>;
export type AddBinderPhotoHandler = RequestHandler<
  { BinderId: string },
  unknown | string,
  { photoIdArr: number[]; BinderId: number },
  Record<string, any>
>;
