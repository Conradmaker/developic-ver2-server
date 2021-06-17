import { RequestHandler } from 'express';

export const isLoggedIn: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('로그인이 필요한 서비스입니다.');
  }
};

export const isNotLoggedIn: RequestHandler = (req, res, next) => {
  if (req.isUnauthenticated()) {
    next();
  } else {
    res.status(401).send('로그인한 사용자는 접근이 불가능합니다.');
  }
};
