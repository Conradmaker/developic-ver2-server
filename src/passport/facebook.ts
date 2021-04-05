import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../db/models/user';

export default (): void => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_API as string,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
        callbackURL: 'http://localhost:8000/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'photos', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        console.log(accessToken);
        console.log(refreshToken);
        try {
          const user = await User.findOne({
            where: {
              email: profile._json.email,
              loginType: 'facebook',
            },
          });
          if (!user) {
            const newUser = await User.create({
              email: profile._json.email,
              name: profile._json.name,
              nickname: profile._json.name,
              loginType: 'facebook',
              refreshToken: refreshToken,
              socialId: profile.id,
              gender: profile.gender === 'male' ? '남성' : '여성',
              //   birth: profile._json.kakao_account.birthday,
              avatar: profile.photos ? profile.photos[0].value : '',
              lastLogin: new Date().toLocaleDateString('KO-kr'),
            });
            done(null, newUser, null);
          } else {
            done(null, user, null);
          }
        } catch (e) {
          done(e);
        }
      }
    )
  );
};
