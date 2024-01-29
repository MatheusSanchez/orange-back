import { FastifyInstance } from 'fastify'
import { createProject } from './createProject'
import { getProjectsByUserId } from './getProjectsByUserId'

export async function projectRoutes(app: FastifyInstance) {
  app.get('/project/:userId', getProjectsByUserId)
  app.post('/user/:userId/project', createProject)
}