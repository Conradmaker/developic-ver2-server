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
