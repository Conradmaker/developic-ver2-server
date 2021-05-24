import { Op, Sequelize } from 'sequelize';
import { sequelize } from '../db/models';
import Exhibition from '../db/models/exhibition';
import ExhibitionImage from '../db/models/exhibitionImage';
import HashTag from '../db/models/hashtag';
import HashTagLog from '../db/models/hashTagLog';
import PicStory from '../db/models/picStory';
import Post from '../db/models/post';
import PostLog from '../db/models/postLog';
import User from '../db/models/user';
import {
  GetExhibitionListHandler,
  GetPostListHandler,
  GetWriterListHandler,
  GetFeedListHandler,
  GetHashTaggedPostHandler,
  GetHashTagListHandler,
  GetSearchedListHandler,
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
         join USER U on P3.UserId = U.id
      limit 15;
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
    const term = () => {
      switch (req.query.term) {
        case 'day':
          return 24;
        case 'month':
          return 24 * 30;
        default:
          return 24;
      }
    };
    let list;
    if (sort === 'recent') {
      list = await Post.findAll({
        limit,
        offset,
        where: { state: 1 },
        attributes: [
          'id',
          'title',
          'thumbnail',
          'summary',
          'createdAt',
          'updatedAt',
        ],
        include: [
          {
            model: User,
            attributes: ['id', 'nickname', 'avatar', 'introduce'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });
    } else if (sort === 'popular') {
      const popularList = await PostLog.findAll({
        where: {
          createdAt: {
            [Op.lt]: new Date(),
            [Op.gt]: new Date(
              new Date().setHours(new Date().getHours() - term())
            ),
          },
        },
        attributes: [[Sequelize.literal('SUM(score)'), 'score'], 'PostId'],
        include: [
          {
            model: Post,
            attributes: [
              'id',
              'title',
              'thumbnail',
              'summary',
              'createdAt',
              'updatedAt',
            ],
            where: { state: 1 },
            include: [
              {
                model: User,
                attributes: ['id', 'nickname', 'avatar', 'introduce'],
              },
            ],
          },
        ],
        group: ['PostId'],
        order: [[Sequelize.literal('score'), 'DESC']],
      });

      list = popularList.map(popItem => popItem.Post);
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
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    const list = await Exhibition.findAll({
      limit,
      offset,
      where: { isAllow: 1 },
      attributes: ['id', 'poster', 'cost', 'title', 'startDate', 'endDate'],
      include: [{ model: User, attributes: ['id', 'email', 'name', 'avatar'] }],
    });
    res.status(200).json(list);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//해시태그에 해당하는 게시글목록 조회
export const getHashTaggedPostController: GetHashTaggedPostHandler = async (
  req,
  res,
  next
) => {
  try {
    const sort = req.query.sort === 'popular' ? 'hits' : 'createdAt';
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 12;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    const tag = await HashTag.findOne({ where: { id: req.params.HashTagId } });
    if (!tag) return res.status(404).send('해당하는 태그를 찾을 수 없습니다.');

    HashTagLog.create({
      date: new Date().toLocaleDateString(),
      score: 1,
      HashTagId: tag.id,
    });

    const resultList = await tag.getPosts({
      where: { state: 1 },
      limit,
      offset,
      order: [[sort, 'DESC']],
      attributes: [
        'id',
        'title',
        'thumbnail',
        'summary',
        'createdAt',
        'updatedAt',
      ],
      include: [
        {
          model: User,
          attributes: ['id', 'nickname', 'avatar', 'introduce'],
        },
      ],
    });

    return res.status(200).json(resultList);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const getHashTagList: GetHashTagListHandler = async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 12;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    const sort = req.query.sort || 'recent';
    const term = () => {
      switch (req.query.term) {
        case 'day':
          return 24;
        case 'month':
          return 24 * 30;
        default:
          return 24;
      }
    };
    let list;
    if (sort === 'recent') {
      list = await HashTag.findAll({
        limit,
        offset,
        attributes: ['id', 'name', 'hits'],
        order: [['createdAt', 'DESC']],
      });
    } else if (sort === 'popular') {
      const popList = await HashTagLog.findAll({
        where: {
          createdAt: {
            [Op.lt]: new Date(),
            [Op.gt]: new Date(
              new Date().setHours(new Date().getHours() - term())
            ),
          },
        },
        attributes: [[Sequelize.literal('SUM(score)'), 'score'], 'HashTagId'],
        include: [{ model: HashTag, attributes: ['id', 'name', 'hits'] }],
        group: ['HashTagId'],
        order: [[Sequelize.literal('score'), 'DESC']],
      });
      list = popList.map(popItem => popItem.HashTag);
    }

    return res.status(200).json(list);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//검색
export const getSearchedListController: GetSearchedListHandler = async (
  req,
  res,
  next
) => {
  try {
    const keyword = req.query.keyword;
    const type = req.query.type;
    const sort = req.query.sort ? req.query.sort : 'recent';
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 12;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    let resultList;
    if (type === 'picstory') {
      resultList = await PicStory.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${keyword}%` } },
            { description: { [Op.like]: `%${keyword}%` } },
          ],
        },
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });
    } else if (type === 'post') {
      if (sort === 'recent') {
        resultList = await Post.findAll({
          where: {
            [Op.and]: [
              { state: 1 },
              {
                [Op.or]: [
                  { title: { [Op.like]: `%${keyword}%` } },
                  { content: { [Op.like]: `%${keyword}%` } },
                ],
              },
            ],
          },
          attributes: [
            'id',
            'title',
            'thumbnail',
            'summary',
            'createdAt',
            'updatedAt',
          ],
          include: [
            {
              model: User,
              attributes: ['id', 'nickname', 'avatar', 'introduce'],
            },
          ],
          order: [['createdAt', 'DESC']],
          limit,
          offset,
        });
      } else {
        const popularList = await PostLog.findAll({
          where: {
            createdAt: {
              [Op.lt]: new Date(),
              [Op.gt]: new Date(
                new Date().setHours(new Date().getHours() - 24 * 30)
              ),
            },
          },
          attributes: [[Sequelize.literal('SUM(score)'), 'score'], 'PostId'],
          include: [
            {
              model: Post,
              attributes: [
                'id',
                'title',
                'thumbnail',
                'summary',
                'createdAt',
                'updatedAt',
              ],
              where: {
                [Op.and]: [
                  { state: 1 },
                  {
                    [Op.or]: [
                      { title: { [Op.like]: `%${keyword}%` } },
                      { content: { [Op.like]: `%${keyword}%` } },
                    ],
                  },
                ],
              },
              include: [
                {
                  model: User,
                  attributes: ['id', 'nickname', 'avatar', 'introduce'],
                },
              ],
            },
          ],
          group: ['PostId'],
          order: [[Sequelize.literal('score'), 'DESC']],
        });

        resultList = popularList.map(popItem => popItem.Post);
      }
    } else if (type === 'writer') {
      if (sort === 'recent') {
        resultList = await User.findAll({
          where: {
            [Op.and]: [
              { verificationCode: 1 },
              {
                [Op.or]: [
                  { introduce: { [Op.like]: `%${keyword}%` } },
                  { nickname: { [Op.like]: `%${keyword}%` } },
                ],
              },
            ],
          },
          attributes: ['id', 'nickname', 'avatar', 'introduce'],
          order: [['createdAt', 'DESC']],
          limit,
          offset,
        });
      } else {
        const popWriterList = await PostLog.findAll({
          where: {
            createdAt: {
              [Op.lt]: new Date(),
              [Op.gt]: new Date(
                new Date().setHours(new Date().getHours() - 24 * 31)
              ),
            },
          },
          limit,
          offset,
          attributes: [[Sequelize.literal('SUM(score)'), 'score']],
          include: [
            {
              model: Post,
              attributes: ['UserId'],
              include: [
                {
                  model: User,
                  where: {
                    [Op.and]: [
                      { verificationCode: 1 },
                      {
                        [Op.or]: [
                          { introduce: { [Op.like]: `%${keyword}%` } },
                          { nickname: { [Op.like]: `%${keyword}%` } },
                        ],
                      },
                    ],
                  },
                  attributes: ['id', 'nickname', 'avatar', 'introduce'],
                },
              ],
            },
          ],
          group: ['UserId'],
          order: [[Sequelize.literal('score'), 'DESC']],
        });
        resultList = popWriterList.map(result =>
          result.Post ? result.Post.User : []
        );
      }
    }
    return res.status(200).json(resultList);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
