import { FastifyInstance } from 'fastify'
import { createProject } from './createProject'
import { getProjectsByUserId } from './getProjectsByUserId'
import { getProjectsById } from './getProjectById'
import { addImageProject } from './addImageToProject'
import FastifyMultipart from '@fastify/multipart'
import { getProjectsByTags } from './getProjectsByTags'
import { editProject } from './editProjectById'
import { deleteProjectById } from './deleteProjectById'
import { verifyJWT } from '../middlewares/verifyJwt'

export async function projectRoutes(app: FastifyInstance) {
  app.register(FastifyMultipart, {
    limits: {
      files: 1,
      fileSize: 1000000, // the max file size in bytes
    },
  })

  app.post('/projects/tags', { onRequest: verifyJWT }, getProjectsByTags)
  app.get('/projects/:userId', { onRequest: verifyJWT }, getProjectsByUserId)
  app.get('/project/:projectId', { onRequest: verifyJWT }, getProjectsById)

  app.post(
    '/project/:projectId/photo',
    { onRequest: verifyJWT },
    addImageProject,
  )
  app.post('/user/:userId/project', { onRequest: verifyJWT }, createProject)

  app.put('/project/:projectId/edit', { onRequest: verifyJWT }, editProject)
  app.delete('/project/:projectId', { onRequest: verifyJWT }, deleteProjectById)
}
