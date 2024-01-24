import { FastifyInstance } from 'fastify'
import { getUserById } from './getUserById'
import { getUserByEmail } from './getUserByEmail'

export async function userRoutes(app: FastifyInstance) {

  app.get('/user/:id', getUserById)
  app.get('/user', getUserByEmail)
}
