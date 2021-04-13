import { RequestHandler } from 'express';
// 파라미터 , 응답바디 , 요청바디, 쿼리
export type GetWriterListHandler = RequestHandler<
  unknown,
  unknown,
  unknown,
  { sort: 'popular' | 'recent'; limit?: string; offset?: string }
>;
export type GetPostListHandler = RequestHandler<
  unknown,
  unknown,
  unknown,
  { sort: 'popular' | 'recent'; limit?: string; offset?: string }
>;
export type GetExhibitionListHandler = RequestHandler<
  unknown,
  unknown,
  unknown,
  { limit?: string; offset?: string }
>;
