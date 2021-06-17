import { RequestHandler } from 'express';

export type GetPostDetailHandler = RequestHandler<
  { PostId: string },
  string | unknown,
  null
>;

export type GetPhotoDetailHandler = RequestHandler<
  { PhotoId: string },
  string | unknown,
  null
>;

export type CreateCommentHandler = RequestHandler<
  unknown,
  string | unknown,
  {
    UserId: number;
    PostId: number;
    content: string;
    mentionedUser: number | null;
  },
  Record<string, any>
>;

export type UpdateCommentHandler = RequestHandler<
  unknown,
  string | unknown,
  { CommentId: number; content: string; mentionedUser: number | null },
  Record<string, any>
>;

export type RemoveCommentHandler = RequestHandler;
