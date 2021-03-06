import PicStory from '../db/models/picStory';
import User from '../db/models/user';
import {
  AddPostPicstoryHandler,
  CreatePicstoryHandler,
  DestroyPicstoryHandler,
  GetUserPicstoryListHandler,
  RemovePostPicstoryHandler,
  UpdatePicstoryHandler,
} from '../types/picsotory';

//NOTE: 새 픽스토리 생성
export const createPicstoryController: CreatePicstoryHandler = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findOne({ where: { id: req.body.UserId } });
    if (!user) return res.status(400).send('해당유저를 찾을 수 없습니다.');
    const newPicstory = await PicStory.create({
      title: req.body.title,
      description: req.body.description,
      thumbnail: req.body.thumbnail,
      UserId: user.id,
    });
    return res
      .status(201)
      .json({ id: newPicstory.id, title: newPicstory.title });
  } catch (e) {
    console.error(e);
    next(e);
  }
};


//픽스토리 정보 수정
export const updatePicstoryController: UpdatePicstoryHandler = async (
  req,
  res,
  next
) => {
  try {
    const picstory = await PicStory.findOne({
      where: { id: req.body.PicstoryId },
    });
    if (!picstory) return res.status(404).send('픽스토리를 찾을 수 없습니다.');
    await picstory.update({
      title: req.body.title,
      description: req.body.description,
      thumbnail: req.body.thumbnail,
    });
    return res.status(201).json(req.body);
  } catch (e) {
    console.error(e);
    next(e);
  }
};


//NOTE: 픽스토리에 게시글 추가
export const addPostPicstoryController: AddPostPicstoryHandler = async (
  req,
  res,
  next
) => {
  try {
    const picstory = await PicStory.findOne({
      where: { id: req.body.PicstoryId },
    });
    if (!picstory)
      return res.status(400).send('해당 픽스토리를 찾지 못했습니다.');
    picstory.addPost(parseInt(req.body.PostId));

    return res.status(201).json({ id: picstory.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 픽스토리에서 게시글 삭제
export const removePostPicstoryController: RemovePostPicstoryHandler = async (
  req,
  res,
  next
) => {
  try {
    const picstory = await PicStory.findOne({
      where: { id: req.body.PicstoryId },
    });
    if (!picstory)
      return res.status(400).send('해당 픽스토리를 찾지 못했습니다.');
    picstory.removePost(parseInt(req.body.PostId));

    return res.status(201).json({ id: picstory.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 픽스토리 삭제
export const destroyPicstoryController: DestroyPicstoryHandler = async (
  req,
  res,
  next
) => {
  try {
    const result = await PicStory.destroy({
      where: { id: req.params.PicstoryId },
    });
    if (!result) return res.status(400).send('에러가 발생하였습니다.');
    res.status(200).json({ id: parseInt(req.params.PicstoryId) });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//NOTE: 픽스토리 목록 조회
export const getUserPicstoryListController: GetUserPicstoryListHandler = async (
  req,
  res,
  next
) => {
  try {
    const picstoryList = await PicStory.findAll({
      where: { UserId: req.params.UserId },
      attributes: ['id', 'title'],
    });
    if (!picstoryList)
      return res.status(400).send('픽스토리를 찾을 수 없습니다.');
    return res.status(200).json(picstoryList);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
