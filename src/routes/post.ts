import express from 'express';
import { Op } from 'sequelize';
import HashTag from '../db/models/hashtag';

const postRouter = express.Router();

postRouter.post('/hashtag', async (req, res, next) => {
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
});

postRouter.get('/hashtag', async (req, res, next) => {
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
});

export default postRouter;
