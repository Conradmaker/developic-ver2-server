import { RequestHandler } from 'express';

export type MakeNewExhibitionHandler = RequestHandler<
  unknown,
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
  Record<string, any>
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
