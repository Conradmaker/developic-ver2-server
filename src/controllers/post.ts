import { RequestHandler } from 'express';
import { Op } from 'sequelize';
import Comment from '../db/models/comment';
import HashTag from '../db/models/hashtag';
import HashTagLog from '../db/models/hashTagLog';
import MetaData from '../db/models/metaData';
import PhotoBinder from '../db/models/photoBinder';
import PicStory from '../db/models/picStory';
import Post from '../db/models/post';
import PostImage from '../db/models/postImage';
import PostLog from '../db/models/postLog';
import RecentView from '../db/models/recentView';
import User from '../db/models/user';
import {
  CreateCommentHandler,
  GetPhotoDetailHandler,
  GetPostDetailHandler,
  RemoveCommentHandler,
  UpdateCommentHandler,
} from '../types/post';

//NOTE: 해시태그 생성
export const addHashTagController: RequestHandler = async (req, res, next) => {
  try {
    const existTag = await HashTag.findOne({ where: { name: req.body.name } });
    if (existTag) {
      return res.status(200).json({ id: existTag.id, name: existTag.name });
    }

    const newTag = await HashTag.create({ name: req.body.name });

    return res.status(200).json({ id: newTag.id, name: newTag.name });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 해시태그 목록 검색
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

//NOTE: 임시저장
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
      const hashTags = await existPost.getHashTags();
      if (hashTags) {
        //기존 태그가 있을경우 해당 개시글 태그들을 삭제하고 점수로그도 삭제한다.
        await existPost.removeHashTags(hashTags);
        for (let i = 0; i < hashTags.length; i++) {
          HashTagLog.destroy({
            where: { HashTagId: hashTags[i].id, score: 2 },
            limit: 1,
          });
        }
      }
      //새로운 태그들의 점수로그와 게시글과 연결시킨다.
      await existPost.addHashTags(req.body.tagList);
      for (let i = 0; i < req.body.tagList.length; i++) {
        HashTagLog.create({
          date: new Date().toLocaleDateString(),
          score: 2,
          type: 'contain',
          HashTagId: req.body.tagList[i],
          UserId: req.user ? req.user.id : null,
        });
      }
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
      if (req.body.tagList) {
        //해시태그가 있을 경우 태그로그와 게시글에 태그 추가
        await newPost.addHashTags(req.body.tagList);
        for (let i = 0; i < req.body.tagList.length; i++) {
          HashTagLog.create({
            date: new Date().toLocaleDateString(),
            score: 2,
            type: 'contain',
            HashTagId: req.body.tagList[i],
            UserId: req.user ? req.user.id : null,
          });
        }
      }

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

//NOTE: 게시글 등록
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

//NOTE: 게시글 삭제
export const removePostController: RequestHandler = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.PostId },
      include: [{ model: User, attributes: ['id'] }],
    });
    if (!post) return res.status(400).send('게시글을 찾을 수 없습니다.');
    if (post.UserId !== +(req.user as User).id)
      return res.status(400).send('작성자와 로그인유저가 일치하지 않습니다.');
    await post.destroy();
    res.status(201).json(post);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 임시저장된 게시글 불러오기
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

//NOTE: 게시글 상세정보 불러오기
export const getPostDetail: GetPostDetailHandler = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.PostId },
      include: [
        { model: User, attributes: ['id', 'nickname', 'avatar', 'introduce'] },
        {
          model: User,
          as: 'likers',
          attributes: ['id'],
          through: { attributes: [] },
        },
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

    const existView = await RecentView.findOne({
      where: {
        UserId: req.user ? (req.user as User).id : 0,
        PostId: req.params.PostId,
      },
    });

    if (!existView) {
      post.update({ hits: post.hits + 1 });
      PostLog.create({
        date: new Date().toLocaleDateString(),
        score: 1,
        type: 'view',
        PostId: post.id,
        UserId: req.user ? req.user.id : null,
      });
    }

    if (req.user) {
      const existView = await RecentView.findOne({
        where: { UserId: req.user.id, PostId: post.id },
      });
      if (existView) {
        existView.update({ date: new Date().toLocaleDateString() });
      } else {
        RecentView.create({
          date: new Date().toLocaleDateString(),
          UserId: req.user.id,
          PostId: post.id,
        });
      }
    }

    return res.status(200).json(post);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 사진 상세정보 불어오기
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

//NOTE: 댓글 등록
export const createCommentController: CreateCommentHandler = async (
  req,
  res,
  next
) => {
  try {
    const newComment = await Comment.create(req.body);
    const computedComment = await Comment.findOne({
      where: { id: newComment.id },
      include: [
        { model: User, attributes: ['id', 'nickname', 'avatar', 'introduce'] },
      ],
    });
    return res.status(201).json(computedComment);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 댓글 수정
export const updateCommentController: UpdateCommentHandler = async (
  req,
  res,
  next
) => {
  try {
    await Comment.update(
      { content: req.body.content },
      { where: { id: req.body.CommentId } }
    );
    const computedComment = await Comment.findOne({
      where: { id: req.body.CommentId },
      include: [
        { model: User, attributes: ['id', 'nickname', 'avatar', 'introduce'] },
      ],
    });
    return res.status(201).json(computedComment);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 댓글 삭제
export const removeCommentController: RemoveCommentHandler = async (
  req,
  res,
  next
) => {
  try {
    const comment = await Comment.findOne({
      where: { id: req.params.CommentId },
      include: [
        { model: User, attributes: ['id', 'nickname', 'avatar', 'introduce'] },
      ],
    });
    if (!comment) return res.status(404).send('해당 댓글을 찾을 수 없습니다.');
    await comment.destroy();
    return res.status(201).json(comment);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
