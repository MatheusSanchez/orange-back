import { FastifyInstance } from 'fastify'
import { createProject } from './createProject'

export async function projectRoutes(app: FastifyInstance) {
  app.post('/user/:userId/project', createProject)
}
