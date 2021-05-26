import express from 'express';
import {
  emailInqueryController,
  getFaqListController,
  getNoticeListController,
} from '../controllers/cs';

const csRouter = express.Router();

csRouter.post('/inquery', emailInqueryController);
csRouter.get('/faq', getFaqListController);
csRouter.get('/notice', getNoticeListController);

export default csRouter;
