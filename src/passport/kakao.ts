import passport from 'passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import User from '../db/models/user';

export default (): void => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_API as string,
        clientSecret: '',
        callbackURL: 'http://192.168.1.189:8000/auth/kakao/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        console.log(profile._json.kakao_account.profile);
        console.log(accessToken);
        console.log(refreshToken);
        try {
          const user = await User.findOne({
            where: {
              email: profile._json.kakao_account.email,
              loginType: 'kakao',
            },
          });
          if (!user) {
            const newUser = await User.create({
              email: profile._json.kakao_account.email,
              name: profile.username,
              nickname: profile.displayName,
              loginType: 'kakao',
              refreshToken: refreshToken,
              accessToken: accessToken,
              socialId: profile.id,
              gender:
                profile._json.kakao_account.gender === 'male' ? '남성' : '여성',
              birth: profile._json.kakao_account.birthday,
              avatar:
                profile._json.kakao_account.profile.profile_image_url ||
                `${process.env.SERVER_DOMAIN}/image/avatar/initial_avatar.png`,
              lastLogin: new Date().toLocaleDateString('KO-kr'),
            });
            done(null, newUser);
          } else {
            done(null, user);
          }
        } catch (e) {
          done(e);
        }
      }
    )
  );
};
