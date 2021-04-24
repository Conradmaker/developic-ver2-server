import cryptoRandomString from 'crypto-random-string';
import bcrypt from 'bcrypt';
import { transporter } from '../routes/auth';
import { mailTemplate } from '../utils/makeMail';
import User from '../db/models/user';
import { RequestHandler } from 'express';
import passport from 'passport';

export const signUpController: RequestHandler = async (req, res, next) => {
  try {
    const randomNumber = cryptoRandomString({ length: 6 });
    const exUser = await User.findOne({
      where: { email: req.body.email, loginType: 'local' },
    });
    if (exUser) return res.status(401).send('이미 존재하는 이메일입니다.');
    await transporter.sendMail({
      from: `"DEVELO_PIC" <${process.env.NODEMAILER_USER}>`,
      to: req.body.email,
      subject: 'DEVELOPIC 회원가입 인증번호',
      text: '안녕하세요!!',
      html: mailTemplate(req.body.name, randomNumber, req.body.email),
    });
    const hashedPassword = await bcrypt.hash(req.body.password, 11);
    const user = await User.create({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      nickname: req.body.nickname,
      loginType: 'local',
      avatar: 'initial_avatar',
      verificationCode: randomNumber,
    });
    if (!user) return res.status(400).send('회원가입중 오류 발생');
    const fullUser = await User.findOne({
      where: { id: user.id },
      attributes: ['id', 'email', 'name'],
    });
    return res.status(201).json(fullUser);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const emailVerificationHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findOne({
      where: { email: req.query.email, verificationCode: req.query.code },
    });
    if (!user) return res.send('올바른 인증번호를 입력해주세요');
    await user.update({ verificationCode: 1 });
    return res.status(200).send('인증이 완료되었습니다. 로그인해주세요!');
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const localLoginController: RequestHandler = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
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
      const computedUser = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: [
            'password',
            'state',
            'createdAt',
            'updatedAt',
            'verificationCode',
          ],
        },
      });
      return res.status(200).json(computedUser);
    });
  })(req, res, next);
};

export const kakaoLoginController: RequestHandler = (req, res, next) => {
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
      return res.redirect(
        `http://localhost:3000/auth?token=${user.accessToken}&type=kakao`
      );
    });
  })(req, res, next);
};

export const facebookLoginController: RequestHandler = (req, res, next) => {
  passport.authenticate('facebook', (err, user) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    return req.login(user, async loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.redirect(
        `http://localhost:3000/auth?token=${user.accessToken}&type=facebook`
      );
    });
  })(req, res, next);
};

export const googleLoginController: RequestHandler = (req, res, next) => {
  passport.authenticate('google', (err, user) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    return req.login(user, async loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.redirect(
        `http://localhost:3000/auth?token=${user.accessToken}&type=google`
      );
    });
  })(req, res, next);
};

export const socialLoginRetest: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { accessToken: req.query.token, loginType: req.query.type },
      attributes: {
        exclude: [
          'password',
          'state',
          'createdAt',
          'updatedAt',
          'verificationCode',
        ],
      },
    });
    if (!user) return res.status(400).send('로그인중 에러발생');
    user.update({ lastLogin: new Date().toLocaleString() });
    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const authController: RequestHandler = async (req, res, next) => {
  try {
    const id = req.user?.id;
    if (id) {
      const user = await User.findOne({ where: { id } });
      if (!user) return res.status(404).send('로그인을 다시 해주세요.');
      return res.status(200).json(user);
    } else {
      return res.status(404).send('로그인을 다시 해주세요.');
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const logoutController: RequestHandler = async (req, res, next) => {
  try {
    await req.logout();
    req.session.destroy(e => console.error(e));
    res.send('ok');
  } catch (e) {
    console.error(e);
    next(e);
  }
};
