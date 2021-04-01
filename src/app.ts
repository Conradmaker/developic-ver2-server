import express from 'express';
import dotenv from 'dotenv-flow';
import cors from 'cors';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import path from 'path';

dotenv.config();
const prod = process.env.NODE_ENV === 'production';
const PORT = prod ? process.env.PROD_PORT : process.env.DEV_PORT;

const app = express();

if (prod) {
  app.use(logger('combined'));
  app.use(cors({ origin: process.env.CLIENT_DOMAIN, credentials: true }));
} else {
  app.use(logger('dev'));
  app.use(cors({ origin: true, credentials: true }));
}
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
      domain: prod ? process.env.CLIENT_DOMAIN : undefined,
      sameSite: 'none',
    },
    name: 'develuth',
  })
);
app.use('/post/photo', express.static(path.join(__dirname, 'uploads/photos')));
app.use('/', (req, res) => {
  res.send('developic 서버');
});
app.listen(PORT, () => console.log(`${PORT}포트에서 서버가 실행되었습니다.`));
