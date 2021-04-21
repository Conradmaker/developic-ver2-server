import { RequestHandler } from 'express';
import { Op } from 'sequelize';
import HashTag from '../db/models/hashtag';
import Post from '../db/models/post';

export const addHashTagController: RequestHandler = async (req, res, next) => {
  try {
    const existTag = await HashTag.findOne({ where: { name: req.body.name } });
    if (existTag)
      return res.status(200).json({ id: existTag.id, name: existTag.name });

    const newTag = await HashTag.create({ name: req.body.name });
    return res.status(200).json({ id: newTag.id, name: newTag.name });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const searchHashTagsController: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const result = await HashTag.findAll({
      where: {
        [Op.or]: [
          {
            name: { [Op.like]: `%${req.query.keyword}%` },
          },
        ],
      },
      attributes: ['id', 'name'],
      limit: 10,
    });
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const preSaveController: RequestHandler = async (req, res, next) => {
  try {
    const postId = req.body.postId ? parseInt(req.body.postId, 10) : null;
    if (postId) {
      const existPost = await Post.findOne({
        where: { id: postId },
        include: [{ model: HashTag, attributes: ['id'] }],
      });
      if (!existPost) return res.status(400).send('게시글을 찾을 수 없습니다.');
      await existPost?.update({
        title: req.body.title,
        content: req.body.content,
      });
      const hashTags = await existPost?.getHashTags();
      await existPost?.removeHashTags(hashTags);
      await existPost?.addHashTags(req.body.tagList);
      return res.status(201).json({ postId: existPost.id });
    } else {
      const newPost = await Post.create({
        title: req.body.title,
        content: req.body.content,
        UserId: req.body.UserId,
        //요약 지워야함
        summary: '',
      });
      await newPost.addHashTags(req.body.tagList);
      return res.status(201).json({ postId: newPost.id });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const submitPostController: RequestHandler = async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.body.PostId } });
    if (!post) return res.status(400).send('게시글을 찾을 수 없습니다.');
    await post.update({
      allowComment: req.body.allowComment,
      isPrimary: req.body.isPublic,
      thumbnail: req.body.thumbnail,
      summary: req.body.summary,
      license: req.body.license,
      state: 1,
    });
    res.status(201).json(post);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
