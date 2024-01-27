import { FastifyInstance } from 'fastify'
import { authUser } from './authUser'

export async function authRoutes(app: FastifyInstance) {

  app.post('/login', authUser)
}