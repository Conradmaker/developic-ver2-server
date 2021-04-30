import express from 'express';
import passport from 'passport';
import nodemailer from 'nodemailer';
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

const authRouter = express.Router();

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});
//NOTE: 회원가입
authRouter.post('/signup', signUpController);

//NOTE: 이메일인증
authRouter.get('/verification', emailVerificationHandler);

//NOTE: 로컬로그인
authRouter.post('/local', localLoginController);

//NOTE: 카카오로그인
authRouter.get('/kakao', passport.authenticate('kakao'));
authRouter.get('/kakao/callback', kakaoLoginController);

//NOTE: 페이스북로그인
authRouter.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['public_profile', 'user_gender', 'user_birthday'],
  })
);
authRouter.get('/facebook/callback', facebookLoginController);

//NOTE: 구글로그인
authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email', 'openid'] })
);
authRouter.get('/google/callback', googleLoginController);

//NOTE: 소셜로그인 인증
authRouter.post('/retest', socialLoginRetest);
export default authRouter;

//NOTE: 로그인 인증
authRouter.get('/', authController);

//NOTE: 로그아웃
authRouter.get('/logout', logoutController);
