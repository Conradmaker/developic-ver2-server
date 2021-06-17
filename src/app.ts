import express from 'express';
import dotenv from 'dotenv-flow';
import cors from 'cors';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import hpp from 'hpp';
import expressSession from 'express-session';
import path from 'path';
import passport from 'passport';
import { sequelize } from './db/models';
import router from './routes';
import passportConfig from './passport';

console.log(process.env.NODE_ENV);

dotenv.config();
const prod = process.env.NODE_ENV === 'production';
const PORT = prod ? process.env.PROD_PORT : process.env.DEV_PORT;

sequelize
  .sync({ force: false })
  .then(() => console.log('디비가 연결되었습니다.'))
  .catch(e => console.error(e));

const app = express();
passportConfig();
if (prod) {
  app.use(logger('combined'));
  app.use(helmet());
  app.use(hpp());
  app.use(
    cors({
      origin: [
        'http://localhost:3000',
        'http://wongeun.xyz',
        'https://developic.netlify.app',
      ],
      credentials: true,
    })
  );
} else {
  app.use(logger('dev'));
  app.use(cors({ origin: true, credentials: true }));
}
app.use('/image', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_KEY));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_KEY as string,
    cookie: {
      httpOnly: true,
      secure: false,
      // sameSite: 'none',
      domain: prod ? process.env.CLIENT_DOMAIN : undefined,
    },
    name: 'develuth',
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use('/post/photo', express.static(path.join(__dirname, 'uploads/photos')));
app.use('/test', (req, res) => {
  console.log(process.env.NODE_ENV);
  res.send(process.env.NODE_ENV);
});
app.use('/api', router);
app.use('/err', (req, res) => res.send('에러'));
app.listen(PORT, () => console.log(`${PORT}포트에서 서버가 실행되었습니다.`));
