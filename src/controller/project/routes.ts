import { FastifyInstance } from 'fastify'
import { createProject } from './createProject'
import { getProjectsByUserId } from './getProjectsByUserId'
import { getProjectsById } from './getProjectById'
import { getProjectsByTags } from './getProjectsByTags'
import { editProject } from './editProjectById'

export async function projectRoutes(app: FastifyInstance) {
  app.post('/projects/tags', getProjectsByTags)
  app.get('/projects/:userId', getProjectsByUserId)
  app.get('/project/:projectId', getProjectsById)
  app.post('/user/:userId/project', createProject)

  app.put('/project/:projectId/edit', editProject)
}
