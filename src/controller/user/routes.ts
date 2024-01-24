import { FastifyInstance } from 'fastify'
import { getUserById } from './getUserById'

export async function userRoutes(app: FastifyInstance) {

  app.get('/user/:id', getUserById)
}
