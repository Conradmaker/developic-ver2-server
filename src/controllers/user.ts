import bcrypt from 'bcrypt';
import PostLog from '../db/models/postLog';
import User from '../db/models/user';
import UserIntro from '../db/models/userIntro';
import {
  GetUserDetailHandler,
  UpdatePasswordHandler,
  UpdateUserInfoHandler,
  UpdateUserIntroHandler,
  DestroyUserHandler,
  ToggleSubscribeHandler,
  getSubscribeListHandler,
  ToggleLikePostHandler,
} from '../types/user';

export const getUserDetailInfoController: GetUserDetailHandler = async (
  req,
  res,
  next
) => {
  try {
    const user = await UserIntro.findOne({
      where: { UserId: req.params.UserId },
      attributes: ['id', 'introduction', 'website', 'mostlyUseModel'],
    });
    if (!user) {
      const newUser = await UserIntro.create({
        introduction: '작성된 소개가 없습니다',
        UserId: req.params.UserId,
        mostlyUseModel: '',
        website: '',
      });
      return res.status(200).json(newUser);
    }
    res.status(200).json(user);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const updateUserInfoController: UpdateUserInfoHandler = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findOne({ where: { id: req.body.UserId } });
    if (!user) return res.status(404).send('해당 유저를 찾을 수 없습니다.');
    await user.update({
      birth: req.body.birth,
      gender: req.body.gender,
      nickname: req.body.nickname,
      avatar: req.body.avatar,
    });

    return res.status(200).json(req.body);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const updatePasswordController: UpdatePasswordHandler = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findOne({ where: { id: req.body.UserId } });
    if (!user) return res.status(404).send('해당 유저를 찾을수 없습니다.');
    const result = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );
    if (!result)
      return res.status(404).send('현재 비밀번호가 일치하지 않습니다.');

    const hashedPassword = await bcrypt.hash(req.body.newPassword, 11);
    await user.update({ password: hashedPassword });
    return res.status(200).send('passwordSuccess');
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const updateUserIntroController: UpdateUserIntroHandler = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findOne({ where: { id: req.body.UserId } });
    if (!user) return res.status(404).send('해당 유저를 찾을 수 없습니다.');
    await user.update({ introduce: req.body.summary });
    await UserIntro.update(
      {
        introduction: req.body.introduction,
        website: req.body.website,
        mostlyUseModel: req.body.mostlyUseModel,
      },
      { where: { UserId: req.body.UserId } }
    );
    return res.status(200).json(req.body);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const destroyUserController: DestroyUserHandler = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findOne({ where: { id: req.params.UserId } });
    if (!user) return res.status(404).send('해당 유저를 찾을 수 없습니다.');
    await UserIntro.destroy({ where: { UserId: req.params.UserId } });
    await user.destroy();
    res.status(200).send('회원정보가 삭제되었습니다.');
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//작가 구독하기
export const subscribeWriter: ToggleSubscribeHandler = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findOne({ where: { id: req.body.writerId } });
    if (!user) return res.status(404).send('해당 유저를 찾을 수 없습니다.');
    await user.addSubscriber(req.body.subscriberId);
    res.status(200).json({ writerId: req.body.writerId });
  } catch (e) {
    console.error(e);
    next(e);
  }
};
//작가 구독취소
export const unSubscribeWriter: ToggleSubscribeHandler = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findOne({ where: { id: req.body.writerId } });
    if (!user) return res.status(404).send('해당 유저를 찾을 수 없습니다.');
    await user.removeSubscriber(req.body.subscriberId);
    res.status(200).json({ writerId: req.body.writerId });
  } catch (e) {
    console.error(e);
    next(e);
  }
};
//구독자 (작가) 목록 조회
export const getSubscribeList: getSubscribeListHandler = async (
  req,
  res,
  next
) => {
  try {
    const attributes = ['id', 'nickname', 'avatar', 'introduce'];
    if (!req.query.type)
      return res.status(400).send('어떤 목록을 조회할지 요청해주세요.');
    const user = await User.findOne({ where: { id: req.params.UserId } });
    if (!user) return res.status(404).send('해당 유저를 찾을 수 없습니다.');
    if (req.query.type === 'subscriber') {
      const list = await user.getSubscribers({ attributes });
      res.status(200).json(list);
    } else {
      const list = await user.getWriters({ attributes });
      res.status(200).json(list);
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//좋아요 추가
export const addLikePostController: ToggleLikePostHandler = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findOne({ where: { id: req.body.UserId } });
    if (!user) return res.status(404).send('다시 로그인 해주세요.');
    await user.addLikedPost(req.body.PostId);
    PostLog.create({
      date: new Date().toLocaleDateString(),
      score: 2,
      type: 'like',
      PostId: req.body.PostId,
      UserId: req.user ? req.user.id : null,
    });
    return res.status(200).json(req.body);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

//좋아요 취소
export const removeLikePostController: ToggleLikePostHandler = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findOne({ where: { id: req.body.UserId } });
    if (!user) return res.status(404).send('다시 로그인 해주세요.');
    await user.removeLikedPost(req.body.PostId);
    PostLog.destroy({
      where: { score: 2, PostId: req.body.PostId },
      limit: 1,
    });
    return res.status(200).json(req.body);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
