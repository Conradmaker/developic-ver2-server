import { RequestHandler } from 'express';

export type GetBloggerInfoHandler = RequestHandler<
  null,
  unknown | string,
  null,
  { email: string; code: string }
>;
