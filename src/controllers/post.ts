import { RequestHandler } from 'express';
import { Op } from 'sequelize';
import Comment from '../db/models/comment';
import HashTag from '../db/models/hashtag';
import MetaData from '../db/models/metaData';
import PhotoBinder from '../db/models/photoBinder';
import PicStory from '../db/models/picStory';
import Post from '../db/models/post';
import PostImage from '../db/models/postImage';
import PostLog from '../db/models/postLog';
import User from '../db/models/user';
import { GetPhotoDetailHandler, GetPostDetailHandler } from '../types/post';

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
    const postId = req.body.PostId ? parseInt(req.body.PostId, 10) : null;
    if (postId) {
      const existPost = await Post.findOne({
        where: { id: postId },
      });
      if (!existPost) return res.status(400).send('게시글을 찾을 수 없습니다.');
      await existPost?.update({
        title: req.body.title,
        content: req.body.content,
      });
      const hashTags = await existPost?.getHashTags();
      await existPost?.removeHashTags(hashTags);
      await existPost?.addHashTags(req.body.tagList);
      req.body.imageList.map((imageId: number) => {
        PostImage.update({ PostId: postId }, { where: { id: imageId } });
      });
      return res.status(201).json({ postId: existPost.id });
    } else {
      const newPost = await Post.create({
        title: req.body.title,
        content: req.body.content,
        UserId: req.body.UserId,
      });
      await newPost.addHashTags(req.body.tagList);
      req.body.imageList.map((imageId: number) => {
        PostImage.update({ PostId: newPost.id }, { where: { id: imageId } });
      });
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

export const getTempPost: RequestHandler = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.PostId },
      include: [{ model: PicStory }],
    });
    if (!post) return res.status(400).send('해당 게시글을 찾을 수 없습니다.');
    const postTags = await post.getHashTags({ attributes: ['id', 'name'] });
    return res.status(200).json({
      id: post.id,
      title: post.title,
      content: post.content,
      allowComment: post.allowComment,
      license: post.license,
      summary: post.summary,
      isPublic: post.isPublic,
      thumbnail: post.thumbnail,
      tagList: postTags,
      PicStories: post.PicStories?.map(v => v.id),
    });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//포스트 디테일 조회
export const getPostDetail: GetPostDetailHandler = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.PostId },
      include: [
        { model: User, attributes: ['id', 'nickname', 'avatar', 'introduce'] },
        { model: User, as: 'likers', attributes: ['id'] },
        { model: HashTag, attributes: ['id', 'name'] },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['id', 'nickname', 'avatar', 'introduce'],
            },
          ],
        },
      ],
    });
    if (!post) return res.status(404).send('게시글을 찾을 수 없습니다.');
    post.update({ hits: post.hits + 1 });
    PostLog.create({
      date: new Date().toLocaleDateString(),
      score: 1,
      PostId: post.id,
    });
    return res.status(200).json(post);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//사진 디테일 조회
export const getPhotoDetail: GetPhotoDetailHandler = async (req, res, next) => {
  try {
    const post = await PostImage.findOne({
      where: { id: req.params.PhotoId },
      attributes: { exclude: ['createdAt'] },
      include: [
        { model: User, attributes: ['id', 'nickname', 'avatar', 'introduce'] },
        {
          model: MetaData,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
        { model: PhotoBinder, attributes: ['id', 'UserId'] },
      ],
    });
    if (!post) return res.status(404).send('게시글을 찾을 수 없습니다.');
    return res.status(200).json(post);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
