import { Op, Sequelize } from 'sequelize';
import { sequelize } from '../db/models';
import Exhibition from '../db/models/exhibition';
import ExhibitionImage from '../db/models/exhibitionImage';
import Post from '../db/models/post';
import User from '../db/models/user';
import {
  GetExhibitionListHandler,
  GetPostListHandler,
  GetWriterListHandler,
  GetFeedListHandler,
} from '../types/list';

//작가 최근활동 순 조회
export const getWriterList: GetWriterListHandler = async (req, res, next) => {
  try {
    const type: 'suber' | 'all' = req.query.type;
    const loginUserId = req.query.userId ? +req.query.userId : null;
    const query =
      type === 'suber'
        ? `
  select id, nickname, email, introduce, avatar, P3.createdAt as 'last_post'
  from (select *
        from (select P.createdAt, P.UserId
              from POST P
                       join SUBSCRIBE S on S.WriterId = P.UserId
              where P.state = 1
                       and S.SubscriberId = :loginUserId
              order by P.createdAt DESC
              LIMIT 18446744073709551615) P2
        group by UserId) P3
           join USER U on P3.UserId = U.id;
`
        : `
select id, nickname, email, introduce, avatar, P3.createdAt as 'last_post'
from (select *
      from (select P.createdAt, P.UserId
            from POST P
            where P.state = 1
            order by P.createdAt DESC
            LIMIT 18446744073709551615) P2
      group by UserId) P3
         join USER U on P3.UserId = U.id;
`;
    const list = await sequelize.query(query, {
      replacements: type === 'suber' ? { loginUserId } : {},
      raw: true,
    });
    res.status(200).send(list[0]);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//피드 불러오기
export const getFeedList: GetFeedListHandler = async (req, res, next) => {
  try {
    const limit = req.query.limit ? +req.query.limit : 12;
    const offset = req.query.offset ? +req.query.offset : 0;
    const list = await Post.findAll({
      where: {
        UserId: {
          [Op.in]: Sequelize.literal(
            `(select S.WriterId from SUBSCRIBE S join USER U on U.id = S.WriterId where S.SubscriberId = ${req.params.UserId})`
          ),
        },
        state: 1,
      },
      limit,
      offset,
      attributes: [
        'id',
        'title',
        'summary',
        'hits',
        'thumbnail',
        'createdAt',
        'updatedAt',
      ],
      include: [
        { model: User, attributes: ['id', 'nickname', 'avatar', 'introduce'] },
        { model: User, as: 'likers', attributes: ['id'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(list);
  } catch (e) {
    console.error(e);
    next(e);
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
