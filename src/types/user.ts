import { RequestHandler } from 'express';
// 파라미터 , 응답바디 , 요청바디, 쿼리
export type GetUserDetailHandler = RequestHandler<
  { UserId: string },
  unknown | string,
  null,
  null
>;
export type UpdateUserIntroHandler = RequestHandler<
  null,
  unknown | string,
  {
    UserId: number;
    introduction: string;
    mostlyUseModel: string;
    website: string;
    summary: string;
  },
  null
>;
export type UpdateUserInfoHandler = RequestHandler<
  null,
  unknown | string,
  {
    UserId: number;
    gender: string;
    birth: string;
    nickname: string;
  },
  null
>;
export type UpdatePasswordHandler = RequestHandler<
  null,
  unknown | string,
  { UserId: number; currentPassword: string; newPassword: string },
  null
>;
export type DestroyUserHandler = RequestHandler<
  { UserId: string },
  unknown | string,
  null,
  null
>;
export type ToggleSubscribeHandler = RequestHandler<
  null,
  unknown | string,
  { subscriberId: number; writerId: number },
  null
>;
export type getSubscribeListHandler = RequestHandler<
  { UserId: string },
  unknown | string,
  null,
  { type: 'writer' | 'subscriber' | null }
>;
