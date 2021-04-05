import passport from 'passport';
import User from '../db/models/user';
import local from './local';

type UserType = Express.User | User;
function isUser(target: UserType): target is User {
  return (target as User).id !== undefined;
}

export default (): void => {
  passport.serializeUser<string>((user: UserType, done) => {
    if (isUser(user)) {
      done(null, user.id);
    }
  });
  passport.deserializeUser<number>(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      return done(null, user);
    } catch (e) {
      console.error(e);
      return done(e);
    }
  });
  local();
};
