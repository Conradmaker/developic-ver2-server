import { RequestHandler } from 'express';

// 파라미터 , 응답바디 , 요청바디, 쿼리
export type GetBloggerInfoHandler = RequestHandler<
  null,
  unknown | string,
  null,
  { email: string; code: string }
>;
