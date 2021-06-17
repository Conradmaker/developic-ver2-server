import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import User from '../db/models/user';

export default (): void => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_API as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: `${process.env.SERVER_DOMAIN}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        console.log(accessToken);
        console.log(refreshToken);
        try {
          const user = await User.findOne({
            where: {
              email: profile._json.email,
              loginType: 'google',
            },
          });
          if (!user) {
            const newUser = await User.create({
              email: profile._json.email,
              name: profile._json.name,
              nickname: profile._json.name,
              loginType: 'google',
              accessToken: accessToken,
              socialId: profile.id,
              avatar:
                profile._json.picture ||
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
