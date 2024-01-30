import { FastifyInstance } from 'fastify'
import { createProject } from './createProject'
import { getProjectsByUserId } from './getProjectsByUserId'
import { getProjectsById } from './getProjectById'

export async function projectRoutes(app: FastifyInstance) {
  app.get('/projects/:userId', getProjectsByUserId)
  app.get('/project/:projectId', getProjectsById)
  app.post('/user/:userId/project', createProject)
}
