import { RequestHandler } from 'express';
// 파라미터 , 응답바디 , 요청바디, 쿼리
export type MakeNewExhibitionHandler = RequestHandler<
  null,
  unknown | string,
  {
    cost: string;
    webPage: string;
    contact: string;
    email: string;
    title: string;
    author: string;
    address: string;
    description: string;
    startDate: string;
    endDate: string;
    poster: string;
    UserId: number;
  },
  null
>;
export type GetExhibitionListHandler = RequestHandler<
  null,
  unknown | string,
  null,
  { limit: string; offset: string }
>;
export type GetExhibitionDetailHandler = RequestHandler<
  { ExhibitionId: string },
  unknown | string,
  null,
  null
>;
