import express from 'express';
import passport from 'passport';

const authRouter = express.Router();

authRouter.get('/kakao', passport.authenticate('kakao'));

authRouter.get('/kakao/callback', (req, res, next) => {
  passport.authenticate('kakao', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.message);
    }
    return req.login(user, async loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      //유저정보 커스텀
      return res.status(200).json(user);
    });
  })(req, res, next);
});

authRouter.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['public_profile', 'user_gender', 'user_birthday'],
  })
);

authRouter.get('/facebook/callback', (req, res, next) => {
  passport.authenticate('facebook', (err, user, info) => {
    if (err) {
      console.log(2);
      console.error(err);
      return next(err);
    }
    return req.login(user, async loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      //유저정보 커스텀
      return res.status(200).json(user);
    });
  })(req, res, next);
});

export default authRouter;
