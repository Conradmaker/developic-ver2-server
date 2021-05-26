import Admin from '../db/models/admin';
import FaQ from '../db/models/faq';
import Notice from '../db/models/notice';
import { transporter } from '../routes/auth';
import {
  GetFaqListHandler,
  GetNoticeListHandler,
  PostEmailInqueryHandler,
} from '../types/cs';
import { makeInqueryMail } from '../utils/makeMail';

export const emailInqueryController: PostEmailInqueryHandler = async (
  req,
  res,
  next
) => {
  try {
    await transporter.sendMail({
      from: `"DEVELO_PIC" <${req.body.email}>`,
      to: process.env.NODEMAILER_USER,
      subject: '[문의]',
      text: '문의입니다.',
      html: makeInqueryMail(req.body),
    });
    return res.status(200).send('성공');
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const getFaqListController: GetFaqListHandler = async (
  req,
  res,
  next
) => {
  try {
    const limit = req.query.limit ? +req.query.limit : 5;
    const offset = req.query.offset ? +req.query.offset : 0;
    const list = await FaQ.findAll({
      limit,
      offset,
      include: [{ model: Admin, attributes: { exclude: ['password'] } }],
      order: [['createdAt', 'DESC']],
    });
    if (!list) return res.status(404).send('알수없는 오류가 발생하였습니다.');
    return res.status(200).json(list);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const getNoticeListController: GetNoticeListHandler = async (
  req,
  res,
  next
) => {
  try {
    const limit = req.query.limit ? +req.query.limit : 5;
    const offset = req.query.offset ? +req.query.offset : 0;
    const list = await Notice.findAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
    if (!list) return res.status(404).send('알수없는 오류가 발생하였습니다.');
    return res.status(200).json(list);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
