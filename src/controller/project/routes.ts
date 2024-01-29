import { FastifyInstance } from 'fastify'
import { getProjectsByUserId } from './getProjectsByUserId'

export async function projectRoutes(app: FastifyInstance) {
  app.get('/project/:userId', getProjectsByUserId)
}
