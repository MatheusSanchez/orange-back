import { Sequelize } from 'sequelize'
import { env } from '../env'

export const sequelize = new Sequelize(
  env.DB_NAME,
  env.DB_USER,
  env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'postgres',
    port: env.DB_PORT,
    logging: (...msg) => console.log(msg),
  },
)
