import { FastifyInstance } from 'fastify'
import { getUserById } from './getUserById'
import { getUserByEmail } from './getUserByEmail'
import { verifyJWT } from '../middlewares/verifyJwt'

export async function userRoutes(app: FastifyInstance) {

  app.get('/user/:id', getUserById)
  // app.get('/user', getUserByEmail)
  app.get('/user', { onRequest: [verifyJWT] }, getUserByEmail)
}
