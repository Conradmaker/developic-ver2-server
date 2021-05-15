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
} from '../types/drawer';

export const getLikesListController: GetLikesListHandler = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findOne({ where: { id: req.params.UserId } });
    if (!user) return res.status(404).send('해당 유저를 찾을 수 없습니다.');
    const likes = await user.getLikedPosts({
      include: [{ model: User, attributes: ['id', 'nickname', 'avatar'] }],
      attributes: ['id', 'title', 'summary', 'hits', 'thumbnail', 'updatedAt'],
    });
    res.status(200).json(likes);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const removeLikesItemController: RemoveLikesItemHandler = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findOne({ where: { id: req.params.UserId } });
    if (!user) return res.status(404).send('해당 유저를 찾을 수 없습니다.');
    await user.removeLikedPost(req.query.PostId);
    return res.status(200).json({ postId: parseInt(req.query.PostId) });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//임시저장글 목록 조회
export const getTempListController: GetTempListHandler = async (
  req,
  res,
  next
) => {
  try {
    const postList = await Post.findAll({
      where: { UserId: req.params.UserId, state: 0 },
      attributes: ['id', 'content', 'title', 'updatedAt'],
    });
    if (!postList) return res.status(400).send('알수없는 에러 발생');
    return res.status(200).json(postList);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
//임시저장글 아이템 삭제
export const removeTempPostController: RemoveTempPostHandler = async (
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

//최근 본 글 리스트 조회
export const getRecentViewsController: GetRecentViewsHandler = async (
  req,
  res,
  next
) => {
  try {
    const recentViews = await RecentView.findAll({
      where: { UserId: req.params.UserId },
      attributes: ['id', 'date'],
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
            'updatedAt',
          ],
        },
      ],
    });
    if (!recentViews)
      return res.status(400).send('알수 없는 오류가 발생하였습니다.');
    return res.status(200).json(recentViews);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//최근본글 항목 삭제
export const removeRecentViewController: RemoveRecentViewHandler = async (
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

//포토바인더 리스트 조회
export const getPhotoBinderListController: GetPhotoBinderListHandler = async (
  req,
  res,
  next
) => {
  try {
    const list = await PhotoBinder.findAll({
      where: { UserId: req.params.UserId },
      include: [{ model: PostImage, attributes: ['id', 'src'] }],
    });
    return res.status(200).json(list);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//포토바인더 디테일 조회
export const getPhotoBinderDetailController: GetPhotoBinderDetailHandler = async (
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

//바인더 정보 수정
export const updatePhotoBinderDetailController: UpdatePhotoBinderDetailHandler = async (
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

//바인더 안의 선택 사진들 삭제
export const removeBinderPhotoController: RemoveBinderPhotoHandler = async (
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

//바인더 안의 선택 사진들 추가
export const addBinderPhotoController: AddBinderPhotoHandler = async (
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

//포토바인더 삭제
export const removePhotoBinderController: RemovePhotoBinderHandler = async (
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
