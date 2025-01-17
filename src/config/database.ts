import { Sequelize } from 'sequelize';
import 'dotenv/config';

export const sequelize = new Sequelize({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  dialect: 'mysql'
});