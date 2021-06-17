import express from 'express';
import {
  getExhibitionDetail,
  getExhibitionList,
  makeNewExhibition,
} from '../controllers/exhibition';
import { isLoggedIn } from '../middlewares/isLoggedIn';

const exhibitionRouter = express.Router();

//NOTE: 새로운 전시회 등록
exhibitionRouter.post('/', isLoggedIn, makeNewExhibition);
//NOTE: 전시회 목록 조회
exhibitionRouter.get('/', getExhibitionList);
//NOTE: 전시회 상세정보 불러오기
exhibitionRouter.get('/:ExhibitionId', getExhibitionDetail);

export default exhibitionRouter;
