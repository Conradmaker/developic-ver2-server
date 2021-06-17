import express from 'express';
import {
  emailInqueryController,
  getFaqListController,
  getNoticeListController,
} from '../controllers/cs';

const csRouter = express.Router();

//NOTE: 이메일 문의 보내기
csRouter.post('/inquery', emailInqueryController);

//NOTE: Faq목록 조회
csRouter.get('/faq', getFaqListController);

//NOTE: 공지사항 조회
csRouter.get('/notice', getNoticeListController);

export default csRouter;
