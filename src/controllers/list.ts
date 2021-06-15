import { Op, Sequelize } from 'sequelize';
import { sequelize } from '../db/models';
import Exhibition from '../db/models/exhibition';
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
import { calcTerm } from '../utils/calcTerm';

//NOTE: 작가 최근활동 순 조회
export const getWriterList: GetWriterListHandler = async (req, res, next) => {
  try {
    const limit = req.query.limit ? +req.query.limit : 12;
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
           join USER U on P3.UserId = U.id
           limit :limit;
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
      limit :limit;
`;
    const list = await sequelize.query(query, {
      replacements: type === 'suber' ? { loginUserId, limit } : { limit },
      raw: true,
    });

    res.status(200).send(list[0]);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 피드목록 조회
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
        {
          model: User,
          as: 'likers',
          attributes: ['id'],
          through: { attributes: [] },
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(list);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 게시글 리스트 조회
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
        where: { state: 1 },
        attributes: [
          'id',
          'title',
          'thumbnail',
          'summary',
          'createdAt',
          'updatedAt',
          'hits',
        ],
        include: [
          {
            model: User,
            attributes: ['id', 'nickname', 'avatar', 'introduce'],
          },
          {
            model: User,
            as: 'likers',
            attributes: ['id'],
            through: { attributes: [] },
          },
          {
            model: HashTag,
            attributes: ['id', 'name'],
            through: { attributes: [] },
          },
        ],
        order: [['createdAt', 'DESC']],
      });
    } else if (sort === 'popular') {
      const term = req.query.term ? req.query.term : 'month';
      const popularList = await PostLog.findAll({
        where: calcTerm(term),
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
              'UserId',
              'hits',
            ],
            where: { state: 1 },
            include: [
              {
                model: User,
                attributes: ['id', 'nickname', 'avatar', 'introduce'],
              },
              {
                model: User,
                as: 'likers',
                attributes: ['id'],
                through: { attributes: [] },
              },
              {
                model: HashTag,
                attributes: ['id', 'name'],
                through: { attributes: [] },
              },
            ],
          },
        ],
        group: ['PostId'],
        order: [[Sequelize.literal('score'), 'DESC']],
        limit,
        offset,
      });

      list = popularList.map(popItem => popItem.Post);
    }

    res.status(200).json(list);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 전시회 목록 조회
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
      attributes: [
        'id',
        'poster',
        'cost',
        'title',
        'author',
        'startDate',
        'endDate',
      ],
      include: [{ model: User, attributes: ['id', 'email', 'name', 'avatar'] }],
      order: [['startDate', 'DESC']],
    });
    res.status(200).json(list);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 해시태그에 해당하는 게시글목록 조회
export const getHashTaggedPostController: GetHashTaggedPostHandler = async (
  req,
  res,
  next
) => {
  try {
    const sort = req.query.sort === 'popular' ? 'hits' : 'createdAt';
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 12;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    const tagOption = req.query.HashtagName
      ? { name: decodeURIComponent(req.query.HashtagName) }
      : { id: req.params.HashTagId };
    const tag = await HashTag.findOne({ where: tagOption });
    if (!tag) return res.status(404).send('해당하는 태그를 찾을 수 없습니다.');

    const currentDate = new Date();
    const existTag = await HashTagLog.findOne({
      where: {
        UserId: req.user?.id || 0,
        createdAt: {
          [Op.gte]: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
          ),
          [Op.lt]: currentDate,
        },
      },
    });

    if (!existTag) {
      HashTagLog.create({
        date: new Date().toLocaleDateString(),
        score: 1,
        type: 'view',
        HashTagId: tag.id,
        UserId: req.user ? req.user.id : null,
      });
    }

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
        'hits',
      ],
      include: [
        {
          model: User,
          attributes: ['id', 'nickname', 'avatar', 'introduce'],
        },
        {
          model: User,
          as: 'likers',
          attributes: ['id'],
          through: { attributes: [] },
        },
      ],
    });

    return res.status(200).json(resultList);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 해시태그 리스트 조회
export const getHashTagList: GetHashTagListHandler = async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 12;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    const sort = req.query.sort || 'recent';
    let list;
    if (sort === 'recent') {
      list = await HashTag.findAll({
        limit,
        offset,
        attributes: ['id', 'name'],
        order: [['createdAt', 'DESC']],
      });
    } else if (sort === 'popular') {
      const term = req.query.term ? req.query.term : 'month';
      const popList = await HashTagLog.findAll({
        where: calcTerm(term),
        attributes: [[Sequelize.literal('SUM(score)'), 'score'], 'HashTagId'],
        include: [{ model: HashTag, attributes: ['id', 'name'] }],
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

//NOTE: 검색
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
    const term = req.query.term ? req.query.term : 'month';
    let resultList;
    if (type === 'picstory') {
      //NOTE: 픽스토리 검색
      resultList = await PicStory.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${keyword}%` } },
            { description: { [Op.like]: `%${keyword}%` } },
          ],
        },
        attributes: [
          'id',
          'title',
          'description',
          'thumbnail',
          'updatedAt',
          'createdAt',
        ],
        include: [
          {
            model: Post,
            where: { state: 1 },
            attributes: [
              'id',
              'title',
              'state',
              'thumbnail',
              'hits',
              'UserId',
              'updatedAt',
              'createdAt',
            ],
            through: { attributes: [] },
            include: [
              {
                model: User,
                as: 'likers',
                attributes: ['id'],
                through: { attributes: [] },
              },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

      return res.status(200).json(resultList);
    } else if (type === 'post') {
      //NOTE: 게시글 검색
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
            'hits',
          ],
          include: [
            {
              model: User,
              attributes: ['id', 'nickname', 'avatar', 'introduce'],
            },
            {
              model: User,
              as: 'likers',
              attributes: ['id'],
              through: { attributes: [] },
            },
          ],
          order: [['createdAt', 'DESC']],
          limit,
          offset,
        });

        return res.status(200).json(resultList);
      } else {
        const popularList = await PostLog.findAll({
          where: calcTerm(term),
          attributes: [[Sequelize.literal('SUM(score)'), 'score'], 'PostId'],
          include: [
            {
              model: Post,
              attributes: ['id'],
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
            },
          ],
          group: ['PostId'],
          order: [[Sequelize.literal('score'), 'DESC']],
        });

        resultList = [];

        for (let i = 0; i < popularList.length; i++) {
          resultList.push(
            await Post.findOne({
              where: { id: popularList[i].PostId },
              attributes: [
                'id',
                'title',
                'thumbnail',
                'summary',
                'createdAt',
                'updatedAt',
                'hits',
                'UserId',
              ],
              include: [
                {
                  model: User,
                  attributes: ['id', 'nickname', 'avatar', 'introduce'],
                },
                {
                  model: User,
                  as: 'likers',
                  attributes: ['id'],
                  through: { attributes: [] },
                },
              ],
            })
          );
        }
        return res.status(200).json(resultList);
      }
    } else if (type === 'writer') {
      //NOTE: 작가 검색
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
          attributes: ['id', 'nickname', 'avatar', 'introduce', 'createdAt'],
          include: [
            {
              model: User,
              as: 'subscribers',
              attributes: ['id'],
              through: { attributes: [] },
            },
            {
              model: User,
              as: 'writers',
              attributes: ['id'],
              through: { attributes: [] },
            },
            {
              model: Post,
              attributes: ['id', 'thumbnail'],
              where: { state: 1 },
            },
          ],
          order: [['createdAt', 'DESC']],
          limit,
          offset,
        });

        return res.status(200).json(resultList);
      } else {
        const popWriterList = await PostLog.findAll({
          where: calcTerm(term),
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
                  attributes: ['id'],
                },
              ],
            },
          ],
          group: ['UserId'],
          order: [[Sequelize.literal('score'), 'DESC']],
        });

        resultList = [];

        for (let i = 0; i < popWriterList.length; i++) {
          if (popWriterList[i].Post as Post) {
            resultList.push(
              await User.findOne({
                where: {
                  id: ((popWriterList[i].Post as Post).User as User).id,
                },
                attributes: [
                  'id',
                  'nickname',
                  'avatar',
                  'introduce',
                  'createdAt',
                ],
                include: [
                  {
                    model: User,
                    as: 'subscribers',
                    attributes: ['id'],
                    through: { attributes: [] },
                  },
                  {
                    model: User,
                    as: 'writers',
                    attributes: ['id'],
                    through: { attributes: [] },
                  },
                  {
                    model: Post,
                    attributes: ['id', 'thumbnail'],
                    where: { state: 1 },
                  },
                ],
              })
            );
          }
        }
        return res.status(200).json(resultList);
      }
    }
    return res.status(404).send('type을 입력해주세요.');
  } catch (e) {
    console.error(e);
    next(e);
  }
};
