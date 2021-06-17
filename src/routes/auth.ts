import express from 'express';
import passport from 'passport';
import {
  authController,
  emailVerificationHandler,
  facebookLoginController,
  googleLoginController,
  kakaoLoginController,
  localLoginController,
  logoutController,
  signUpController,
  socialLoginRetest,
} from '../controllers/auth';
import { isLoggedIn, isNotLoggedIn } from '../middlewares/isLoggedIn';

const authRouter = express.Router();

//NOTE: 회원가입
authRouter.post('/signup', isNotLoggedIn, signUpController);

//NOTE: 이메일인증
authRouter.get('/verification', emailVerificationHandler);

//NOTE: 로컬로그인
authRouter.post('/local', isNotLoggedIn, localLoginController);

//NOTE: 카카오로그인
authRouter.get('/kakao', isNotLoggedIn, passport.authenticate('kakao'));
authRouter.get('/kakao/callback', kakaoLoginController);

//NOTE: 페이스북로그인
authRouter.get(
  '/facebook',
  isNotLoggedIn,
  passport.authenticate('facebook', {
    scope: ['public_profile', 'user_gender', 'user_birthday'],
  })
);
authRouter.get('/facebook/callback', facebookLoginController);

//NOTE: 구글로그인
authRouter.get(
  '/google',
  isNotLoggedIn,
  passport.authenticate('google', { scope: ['profile', 'email', 'openid'] })
);
authRouter.get('/google/callback', googleLoginController);

//NOTE: 소셜로그인 인증
authRouter.post('/retest', socialLoginRetest);

//NOTE: 로그인 인증
authRouter.get('/', authController);

//NOTE: 로그아웃
authRouter.get('/logout', isLoggedIn, logoutController);

export default authRouter;
