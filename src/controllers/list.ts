import Exhibition from '../db/models/exhibition';
import ExhibitionImage from '../db/models/exhibitionImage';
import Post from '../db/models/post';
import User from '../db/models/user';
import {
  GetExhibitionListHandler,
  GetPostListHandler,
  GetWriterListHandler,
} from '../types/list';

export const getWriterList: GetWriterListHandler = async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 12;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    const sort = req.query.sort || 'recent';
    let list;

    if (sort === 'recent') {
      list = await User.findAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        where: { verificationCode: 1 },
        attributes: [
          'id',
          'email',
          'nickname',
          'introduce',
          'avatar',
          'createdAt',
        ],
        include: [],
      });
    } else if (sort === 'popular') {
      list = await User.findAll({
        limit,
        offset,
        // order: [['createdAt', 'DESC']],
        where: { verificationCode: 1 },
        attributes: [
          'id',
          'email',
          'nickname',
          'introduce',
          'avatar',
          'createdAt',
        ],
        include: [],
      });
    }

    res.status(200).json(list);
  } catch (e) {
    console.error(e);
  }
};

export const getPostList: GetPostListHandler = async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 12;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    const sort = req.query.sort || 'recent';
    let list;
    if (sort === 'recent') {
      list = await Post.findAll({
        limit,
        offset,
        where: {},
        attributes: [],
        include: [{ model: User, attributes: [] }],
        order: [['createdAt', 'DESC']],
      });
    } else if (sort === 'popular') {
      list = await Post.findAll({
        limit,
        offset,
        where: {},
        attributes: [],
        include: [{ model: User, attributes: [] }],
        // order: [['createdAt', 'DESC']],
      });
    }

    res.status(200).json(list);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const getExhibitionList: GetExhibitionListHandler = async (
  req,
  res,
  next
) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 12;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    const list = await Exhibition.findAll({
      limit,
      offset,
      where: {},
      attributes: [],
      include: [
        { model: ExhibitionImage, attributes: [] },
        { model: User, attributes: [] },
      ],
    });
    res.status(200).json(list);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
