import PicStory from '../db/models/picStory';
import Post from '../db/models/post';
import User from '../db/models/user';
import UserIntro from '../db/models/userIntro';
import {
  GetBloggerInfoHandler,
  GetBloggerPostListHandler,
  GetBloggerPicstoryListHandler,
  GetBloggerPicPostListHandler,
} from '../types/blog';

export const getBloggerInfoController: GetBloggerInfoHandler = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.UserId },
      attributes: ['id', 'email', 'name', 'nickname', 'introduce', 'avatar'],
    });
    if (!user) return res.status(404).send('해당 유저를 찾을 수 없습니다.');
    const userInfo = await UserIntro.findOne({
      where: { id: req.params.UserId },
      attributes: ['introduction', 'website', 'mostlyUseModel'],
    });
    const suber = await user.getSubscribers({ attributes: ['id'] });
    const writer = await user.getWriters({ attributes: ['id'] });
    const result = {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      introduce: user.introduce,
      avatar: user.avatar,
      introduction: userInfo?.introduction,
      website: userInfo?.website,
      mostlyUseModel: userInfo?.mostlyUseModel,
      suberCount: suber.length,
      writerCount: writer.length,
    };
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const getBloggerPostListController: GetBloggerPostListHandler = async (
  req,
  res,
  next
) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 8;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    const list = await Post.findAll({
      limit,
      offset,
      where: { UserId: req.params.UserId },
      attributes: ['id', 'title', 'summary', 'thumbnail', 'hits', 'updatedAt'],
      order: [['updatedAt', 'DESC']],
      include: [{ model: User, as: 'likers', attributes: ['id'] }],
    });
    for (let i = 0; i < list.length; i++) {
      const a = await list[i].getLikers();
      list[i] = {
        id: list[i].id,
        title: list[i].title,
        summary: list[i].summary,
        thumbnail: list[i].thumbnail,
        hits: list[i].hits,
        likeCount: a.length,
        updatedAt: list[i].updatedAt,
      } as Post;
    }
    res.status(200).json(list);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const getBloggerPicstoryListController: GetBloggerPicstoryListHandler = async (
  req,
  res,
  next
) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    const picstories = await PicStory.findAll({
      where: { UserId: req.params.UserId },
      limit,
      offset,
      attributes: ['id', 'title', 'description', 'thumbnail', 'updatedAt'],
      order: [['updatedAt', 'DESC']],
      include: [
        {
          model: Post,
          attributes: ['id', 'title', 'thumbnail', 'hits'],
          include: [{ model: User, as: 'likers', attributes: ['id'] }],
        },
      ],
    });
    if (!picstories) return res.status(404).send('아이디를 확인해주세요.');
    res.status(200).json(picstories);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const getBloggerPicPostListController: GetBloggerPicPostListHandler = async (
  req,
  res,
  next
) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 6;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
    const picPosts = await PicStory.findOne({
      where: { id: req.params.PicstoryId },
      limit,
      offset,
      attributes: ['id', 'title', 'description', 'thumbnail'],
      include: [
        {
          model: Post,
          attributes: ['id', 'title', 'thumbnail', 'summary', 'hits'],
          order: [['updatedAt', 'DESC']],
          include: [{ model: User, as: 'likers', attributes: ['id'] }],
        },
      ],
    });
    if (!picPosts) return res.status(404).send('픽스토리를 찾을 수 없습니다.');
    const computedPosts = (picPosts.Posts as Post[]).map(post => ({
      id: post.id,
      title: post.title,
      summary: post.summary,
      thumbnail: post.thumbnail,
      hits: post.hits,
      likeCount: (post.likers as User[]).length,
    }));
    return res.status(200).json({
      id: picPosts.id,
      title: picPosts.title,
      description: picPosts.title,
      thumbnail: picPosts.thumbnail,
      Posts: computedPosts,
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};
