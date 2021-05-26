import { RequestHandler } from 'express';

export type GetWriterListHandler = RequestHandler<
  unknown,
  unknown,
  unknown,
  { type: 'suber' | 'all'; userId?: number; limit?: string }
>;
export type GetFeedListHandler = RequestHandler<
  { UserId: string },
  unknown,
  unknown,
  { limit?: string; offset?: string }
>;
export type GetPostListHandler = RequestHandler<
  unknown,
  unknown,
  unknown,
  {
    sort: 'popular' | 'recent';
    limit?: string;
    offset?: string;
    term: 'month' | 'day';
  }
>;
export type GetHashTaggedPostHandler = RequestHandler<
  { HashTagId: number },
  unknown,
  unknown,
  {
    sort: 'popular' | 'recent';
    limit?: string;
    offset?: string;
    HashtagName?: string;
  }
>;
export type GetHashTagListHandler = RequestHandler<
  unknown,
  unknown,
  unknown,
  {
    sort: 'popular' | 'recent';
    limit?: string;
    offset?: string;
    term: 'month' | 'day';
  }
>;
export type GetExhibitionListHandler = RequestHandler<
  unknown,
  unknown,
  unknown,
  { limit?: string; offset?: string }
>;

export type GetSearchedListHandler = RequestHandler<
  unknown,
  unknown,
  unknown,
  {
    keyword: string;
    type: 'picstory' | 'post' | 'writer';
    sort?: 'recent' | 'popular';
    limit?: string;
    offset?: string;
  }
>;
