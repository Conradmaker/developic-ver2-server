import PhotoBinder from '../db/models/photoBinder';
import Post from '../db/models/post';
import PostImage from '../db/models/postImage';
import RecentView from '../db/models/recentView';
import User from '../db/models/user';
import {
  GetLikesListHandler,
  GetPhotoBinderDetailHandler,
  GetPhotoBinderListHandler,
  GetRecentViewsHandler,
  GetTempListHandler,
  RemoveLikesItemHandler,
  RemoveRecentViewHandler,
  RemoveTempPostHandler,
  UpdatePhotoBinderDetailHandler,
  RemoveBinderPhotoHandler,
  RemovePhotoBinderHandler,
  AddBinderPhotoHandler,
  CreatePhotoBinderHandler,
} from '../types/drawer';

//NOTE: 좋아요 게시글 목록 조회
export const getLikesListCtr: GetLikesListHandler = async (req, res, next) => {
  try {
    const limit = req.query.limit ? +req.query.limit : 12;
    const offset = req.query.offset ? +req.query.offset : 0;
    const user = await User.findOne({ where: { id: req.params.UserId } });
    if (!user) return res.status(404).send('해당 유저를 찾을 수 없습니다.');
    const likes = await user.getLikedPosts({
      include: [{ model: User, attributes: ['id', 'nickname', 'avatar'] }],
      attributes: [
        'id',
        'title',
        'summary',
        'hits',
        'thumbnail',
        'createdAt',
        'updatedAt',
      ],
      limit,
      offset,
    });
    res.status(200).json(likes);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 좋아요 항목 삭제
export const removeLikesItemCtr: RemoveLikesItemHandler = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findOne({ where: { id: req.params.UserId } });
    if (!user) return res.status(404).send('해당 유저를 찾을 수 없습니다.');
    await user.removeLikedPost(+req.query.PostId);
    return res.status(200).json({ postId: parseInt(req.query.PostId) });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 임시저장 게시글 목록 조회
export const getTempListCtr: GetTempListHandler = async (req, res, next) => {
  try {
    const limit = req.query.limit ? +req.query.limit : 12;
    const offset = req.query.offset ? +req.query.offset : 0;
    const postList = await Post.findAll({
      where: { UserId: req.params.UserId, state: 0 },
      attributes: ['id', 'content', 'title', 'createdAt', 'updatedAt'],
      limit,
      offset,
    });
    if (!postList) return res.status(400).send('알수없는 에러 발생');
    return res.status(200).json(postList);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 임시저장 게시글 삭제
export const removeTempPostCtr: RemoveTempPostHandler = async (
  req,
  res,
  next
) => {
  try {
    const result = await Post.destroy({ where: { id: req.params.PostId } });
    if (!result) return res.status(400).send('게시글을 찾을 수 없습니다.');
    return res.status(200).json({ postId: parseInt(req.params.PostId) });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 최근 본 글 목록 조회
export const getRecentViewsCtr: GetRecentViewsHandler = async (
  req,
  res,
  next
) => {
  try {
    const limit = req.query.limit ? +req.query.limit : 12;
    const offset = req.query.offset ? +req.query.offset : 0;
    const recentViews = await RecentView.findAll({
      where: { UserId: req.params.UserId },
      attributes: ['id', 'date', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Post,
          include: [{ model: User, attributes: ['id', 'nickname', 'avatar'] }],
          attributes: [
            'id',
            'title',
            'summary',
            'hits',
            'thumbnail',
            'createdAt',
            'updatedAt',
          ],
        },
      ],
      limit,
      offset,
      order: [['updatedAt', 'DESC']],
    });
    if (!recentViews)
      return res.status(400).send('알수 없는 오류가 발생하였습니다.');
    return res.status(200).json(recentViews);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 최근 본 글 삭제
export const removeRecentViewCtr: RemoveRecentViewHandler = async (
  req,
  res,
  next
) => {
  try {
    const result = await RecentView.destroy({
      where: { id: req.params.RecentId },
    });
    if (!result) return res.status(400).send('알수없는 오류가 발생하였습니다.');
    return res.status(200).json({ recentId: +req.params.RecentId });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 포토바인더 목록 조회
export const getBinderListCtr: GetPhotoBinderListHandler = async (
  req,
  res,
  next
) => {
  try {
    const limit = req.query.limit ? +req.query.limit : 12;
    const offset = req.query.offset ? +req.query.offset : 0;
    const list = await PhotoBinder.findAll({
      where: { UserId: req.params.UserId },
      include: [{ model: PostImage, attributes: ['id', 'src'] }],
      limit,
      offset,
    });
    return res.status(200).json(list);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 포토바인더 안의 사진정보 및 디테일 불러오기
export const getBinderDetailCtr: GetPhotoBinderDetailHandler = async (
  req,
  res,
  next
) => {
  try {
    const detail = await PhotoBinder.findOne({
      where: { id: req.params.BinderId },
      include: [{ model: PostImage, attributes: ['id', 'src'] }],
    });
    return res.status(200).json(detail);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 포토바인더 수정
export const updateBinderDetailCtr: UpdatePhotoBinderDetailHandler = async (
  req,
  res,
  next
) => {
  try {
    const binder = await PhotoBinder.findOne({
      where: { id: req.body.BinderId },
    });
    if (!binder) return res.status(404).send('포토바인더를 찾을 수 없습니다.');
    await binder.update({
      title: req.body.title,
      description: req.body.description,
    });
    return res.status(201).json(req.body);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 포토바인더에서 사진 삭제
export const removeBinderPhotoCtr: RemoveBinderPhotoHandler = async (
  req,
  res,
  next
) => {
  try {
    const binder = await PhotoBinder.findOne({
      where: { id: req.body.BinderId },
    });
    if (!binder) return res.status(404).send('바인더를 찾을 수 없습니다.');
    for (let index = 0; index < req.body.photoIdArr.length; index++) {
      await binder.removePostImage(req.body.photoIdArr[index]);
    }
    res.status(200).json(req.body);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 포토바인더에 사진 추가
export const addBinderPhotoCtr: AddBinderPhotoHandler = async (
  req,
  res,
  next
) => {
  try {
    const binder = await PhotoBinder.findOne({
      where: { id: req.body.BinderId },
    });
    if (!binder) return res.status(404).send('바인더를 찾을 수 없습니다.');
    await binder.addPostImages(req.body.photoIdArr);
    res.status(200).json(req.body);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 포토바인더 생성
export const createBinderCtr: CreatePhotoBinderHandler = async (
  req,
  res,
  next
) => {
  try {
    const newBinder = await PhotoBinder.create(req.body);
    const computedBinder = await PhotoBinder.findOne({
      where: { id: newBinder.id },
      include: [{ model: PostImage, attributes: ['id', 'src'] }],
    });
    if (!computedBinder)
      return res.status(400).send('생성중 오류가 발생하였습니다.');
    return res.status(201).json(computedBinder);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 포토바인더 삭제
export const removeBinderCtr: RemovePhotoBinderHandler = async (
  req,
  res,
  next
) => {
  try {
    const result = await PhotoBinder.destroy({
      where: { id: req.params.BinderId },
    });
    if (!result) return res.status(400).send('삭제에 실패하였습니다.');
    return res.status(200).json({ binderId: +req.params.BinderId });
  } catch (e) {
    console.error(e);
    next(e);
  }
};
