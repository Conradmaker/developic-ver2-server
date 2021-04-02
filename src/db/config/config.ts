import dotenv from 'dotenv-flow';

dotenv.config();
type ConfigType = {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: 'mysql';
  [key: string]: string | boolean;
};
interface ConfigGroup {
  development: ConfigType;
  test: ConfigType;
  production: ConfigType;
}
const config: ConfigGroup = {
  development: {
    username: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    host: process.env.DB_HOST as string,
    dialect: 'mysql',
  },
  test: {
    username: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    host: process.env.DB_HOST as string,
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    host: process.env.DB_HOST as string,
    dialect: 'mysql',
  },
};

export default config;
