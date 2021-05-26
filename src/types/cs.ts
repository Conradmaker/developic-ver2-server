import { RequestHandler } from 'express';

export type PostEmailInqueryHandler = RequestHandler<
  null,
  unknown,
  { email: string; contact: string; type: string; content: string },
  null
>;

export type GetFaqListHandler = RequestHandler<
  null,
  unknown,
  null,
  { limit?: string; offset?: string }
>;

export type GetNoticeListHandler = RequestHandler<
  null,
  unknown,
  null,
  { limit?: string; offset?: string }
>;
