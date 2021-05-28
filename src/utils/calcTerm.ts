import { Op } from 'sequelize';

type CalcTermType = (
  term: 'all' | 'year' | 'month' | 'week' | 'day'
) =>
  | {
      createdAt: {
        [Op.lt]: Date;
        [Op.gt]: Date;
      };
    }
  | {
      createdAt?: undefined;
    };

export const calcTerm: CalcTermType = term => {
  switch (term) {
    case 'all':
      return {
        createdAt: {
          [Op.lt]: new Date(),
          [Op.gt]: new Date(
            new Date().setHours(new Date().getHours() - 24 * 31)
          ),
        },
      };
    case 'year':
      return {
        createdAt: {
          [Op.lt]: new Date(),
          [Op.gt]: new Date(
            new Date().setHours(new Date().getHours() - 24 * 31)
          ),
        },
      };
    case 'month':
      return {
        createdAt: {
          [Op.lt]: new Date(),
          [Op.gt]: new Date(
            new Date().setHours(new Date().getHours() - 24 * 31)
          ),
        },
      };
    case 'week':
      return {
        createdAt: {
          [Op.lt]: new Date(),
          [Op.gt]: new Date(
            new Date().setHours(new Date().getHours() - 24 * 7)
          ),
        },
      };
    case 'day':
      return {
        createdAt: {
          [Op.lt]: new Date(),
          [Op.gt]: new Date(
            new Date().setHours(new Date().getHours() - 24 * 1)
          ),
        },
      };
    default:
      return {};
  }
};
