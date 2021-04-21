import { RequestHandler } from 'express';

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
