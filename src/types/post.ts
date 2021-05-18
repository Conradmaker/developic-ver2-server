import { RequestHandler } from 'express';

export type GetPostDetailHandler = RequestHandler<
  { PostId: string },
  string | unknown,
  null,
  null
>;

export type GetPhotoDetailHandler = RequestHandler<
  { PhotoId: string },
  string | unknown,
  null,
  null
>;

export type CreateCommentHandler = RequestHandler<
  null,
  string | unknown,
  {
    UserId: number;
    PostId: number;
    content: string;
    mentionedUser: number | null;
  },
  null
>;

export type UpdateCommentHandler = RequestHandler<
  null,
  string | unknown,
  { CommentId: number; content: string; mentionedUser: number | null },
  null
>;

export type RemoveCommentHandler = RequestHandler<
  { CommentId: number },
  string | unknown,
  null,
  null
>;
