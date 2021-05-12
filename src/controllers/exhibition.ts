import Exhibition from '../db/models/exhibition';
import User from '../db/models/user';
import {
  GetExhibitionDetailHandler,
  GetExhibitionListHandler,
  MakeNewExhibitionHandler,
} from '../types/exhibition';

//전시회 등록
export const makeNewExhibition: MakeNewExhibitionHandler = async (
  req,
  res,
  next
) => {
  try {
    const newExhibition = await Exhibition.create({ ...req.body, isAllow: 0 });
    return res.status(201).json(newExhibition);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//전시회 리스트 조회
export const getExhibitionList: GetExhibitionListHandler = async (
  req,
  res,
  next
) => {
  try {
    const limit = req.query.limit ? +req.query.limit : 8;
    const offset = req.query.offset ? +req.query.offset : 0;
    const list = await Exhibition.findAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['id', 'email', 'name', 'avatar'] }],
    });
    if (!list) return res.status(404).send('전시회 목록을 찾을 수 없습니다.');
    return res.status(200).json(list);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//전시회 디테일 조회
export const getExhibitionDetail: GetExhibitionDetailHandler = async (
  req,
  res,
  next
) => {
  try {
    const detailInfo = await Exhibition.findOne({
      where: { id: req.params.ExhibitionId },
      include: [{ model: User, attributes: ['id', 'email', 'name', 'avatar'] }],
    });
    if (!detailInfo)
      return res.status(404).send('전시회 목록을 찾을 수 없습니다.');
    return res.status(200).json(detailInfo);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
