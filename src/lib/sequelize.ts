import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize('orange-db', 'docker', 'docker', {
  host: 'localhost',
  dialect: 'postgres',
  port: 8080,
  logging: (...msg) => console.log(msg),
})
