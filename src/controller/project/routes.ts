import { FastifyInstance } from 'fastify'
import { createProject } from './createProject'
import { getProjectsByUserId } from './getProjectsByUserId'
import { getProjectsById } from './getProjectById'
import { getProjectsByTags } from './getProjectByTags'

export async function projectRoutes(app: FastifyInstance) {
  app.get('/projects/:userId', getProjectsByUserId)
  app.get('/projects/tags/:projectTags', getProjectsByTags)
  app.get('/project/:projectId', getProjectsById)
  app.post('/user/:userId/project', createProject)
}
