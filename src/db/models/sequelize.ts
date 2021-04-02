import { Sequelize } from 'sequelize';
import config from '../config/config';

type envType = 'production' | 'development' | 'test';
const env = (process.env.NODE_ENV as envType) || 'development';
const { database, password, username, host, dialect } = config[env];
const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
});
export { sequelize };
export default sequelize;
