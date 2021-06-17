import { RequestHandler } from 'express';

export type GetUserDetailHandler = RequestHandler<
  { UserId: string },
  unknown | string,
  Record<string, any>
>;
export type UpdateUserIntroHandler = RequestHandler<
  unknown,
  unknown | string,
  {
    UserId: number;
    introduction: string;
    mostlyUseModel: string;
    website: string;
    summary: string;
  },
  Record<string, any>
>;
export type UpdateUserInfoHandler = RequestHandler<
  unknown,
  unknown | string,
  {
    UserId: number;
    gender: string;
    birth: string;
    nickname: string;
    avatar: string;
  },
  Record<string, any>
>;
export type UpdatePasswordHandler = RequestHandler<
  unknown,
  unknown | string,
  { UserId: number; currentPassword: string; newPassword: string },
  Record<string, any>
>;
export type DestroyUserHandler = RequestHandler<
  { UserId: string },
  unknown | string,
  Record<string, any>
>;
export type ToggleSubscribeHandler = RequestHandler<
  unknown,
  unknown | string,
  { subscriberId: number; writerId: number },
  Record<string, any>
>;
export type getSubscribeListHandler = RequestHandler<
  { UserId: string },
  unknown | string,
  { type: 'writer' | 'subscriber' | null }
>;
export type ToggleLikePostHandler = RequestHandler<
  unknown,
  unknown | string,
  { UserId: number; PostId: number },
  Record<string, any>
>;
