import express from 'express';
import {
  getExhibitionDetail,
  getExhibitionList,
  makeNewExhibition,
} from '../controllers/exhibition';

const exhibitionRouter = express.Router();

exhibitionRouter.post('/', makeNewExhibition);
exhibitionRouter.get('/', getExhibitionList);
exhibitionRouter.get('/:ExhibitionId', getExhibitionDetail);

export default exhibitionRouter;
