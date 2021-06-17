import cryptoRandomString from 'crypto-random-string';
import bcrypt from 'bcrypt';
import { verificationMailTemplate } from '../utils/makeMail';
import User from '../db/models/user';
import { RequestHandler } from 'express';
import passport from 'passport';
import Post from '../db/models/post';
import Comment from '../db/models/comment';
import { transporter } from '../middlewares/nodeMailer';

//NOTE: 회원가입
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
      html: verificationMailTemplate(
        req.body.name,
        randomNumber,
        req.body.email
      ),
    });
    const hashedPassword = await bcrypt.hash(req.body.password, 11);
    const user = await User.create({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      nickname: req.body.nickname,
      loginType: 'local',
      avatar: `${process.env.SERVER_DOMAIN}/image/avatar/initial_avatar.png`,
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

//NOTE: 이메일인증
export const emailVerificationHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.query.email,
        verificationCode: req.query.code,
        loginType: 'local',
      },
    });
    if (!user) return res.status(404).send('올바른 인증번호를 입력해주세요');
    await user.update({ verificationCode: 1 });
    return res.status(200).send('인증이 완료되었습니다. 로그인해주세요!');
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 로컬로그인
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
        include: [
          {
            model: User,
            as: 'subscribers',
            attributes: ['id'],
            through: { attributes: [] },
          },
          {
            model: User,
            as: 'writers',
            attributes: ['id'],
            through: { attributes: [] },
          },
          {
            model: Post,
            as: 'likedPosts',
            attributes: ['id'],
            through: { attributes: [] },
          },
          {
            model: Comment,
            as: 'likedComments',
            attributes: ['id'],
            through: { attributes: [] },
          },
        ],
      });
      user.update({ lastLogin: new Date().toLocaleString() });
      return res.status(200).json(computedUser);
    });
  })(req, res, next);
};

//NOTE: 카카오로그인
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
        `${process.env.CLIENT_DOMAIN}/user/social?email=${user.email}&type=kakao`
      );
    });
  })(req, res, next);
};

//NOTE: 페이스북로그인
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
        `${process.env.CLIENT_DOMAIN}/user/social?email=${user.email}&type=facebook`
      );
    });
  })(req, res, next);
};

//NOTE: 구글로그인
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
        `${process.env.CLIENT_DOMAIN}/user/social?email=${user.email}&type=google`
      );
    });
  })(req, res, next);
};

//NOTE: 소셜로그인 인증
export const socialLoginRetest: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
        loginType: req.body.loginType,
      },
      attributes: {
        exclude: [
          'password',
          'state',
          'createdAt',
          'updatedAt',
          'verificationCode',
        ],
      },
      include: [
        {
          model: User,
          as: 'subscribers',
          attributes: ['id'],
          through: { attributes: [] },
        },
        {
          model: User,
          as: 'writers',
          attributes: ['id'],
          through: { attributes: [] },
        },
        {
          model: Post,
          as: 'likedPosts',
          attributes: ['id'],
          through: { attributes: [] },
        },
        {
          model: Comment,
          as: 'likedComments',
          attributes: ['id'],
          through: { attributes: [] },
        },
      ],
    });
    if (!user) return res.status(400).send('로그인중 에러발생');
    user.update({ lastLogin: new Date().toLocaleString() });
    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 로그인 인증
export const authController: RequestHandler = async (req, res, next) => {
  try {
    const id = req.user?.id;
    if (id) {
      const user = await User.findOne({
        where: { id },
        attributes: {
          exclude: [
            'password',
            'state',
            'createdAt',
            'updatedAt',
            'verificationCode',
          ],
        },
        include: [
          {
            model: User,
            as: 'subscribers',
            attributes: ['id'],
            through: { attributes: [] },
          },
          {
            model: User,
            as: 'writers',
            attributes: ['id'],
            through: { attributes: [] },
          },
          {
            model: Post,
            as: 'likedPosts',
            attributes: ['id'],
            through: { attributes: [] },
          },
          {
            model: Comment,
            as: 'likedComments',
            attributes: ['id'],
            through: { attributes: [] },
          },
        ],
      });
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

//NOTE: 로그아웃
export const logoutController: RequestHandler = (req, res) => {
  req.logout();
  req.session.destroy(() => {
    res.clearCookie('develuth');
    res.send('ok');
  });
};
