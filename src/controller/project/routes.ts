import { FastifyInstance } from 'fastify'
import { createProject } from './createProject'
import { getProjectsByUserId } from './getProjectsByUserId'
import { getProjectsById } from './getProjectById'
import { addImageProject } from './addImageToProject'
import FastifyMultipart from '@fastify/multipart'
import path from 'path'
import fastifyStatic from '@fastify/static'

export async function projectRoutes(app: FastifyInstance) {
  app.register(FastifyMultipart, {
    limits: {
      files: 1,
      fileSize: 1000000, // the max file size in bytes
    },
  })

  app.register(fastifyStatic, {
    root: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    prefix: '/project/photo',
  })

  app.get('/projects/:userId', getProjectsByUserId)
  app.get('/project/:projectId', getProjectsById)

  app.post('/project/:projectId/photo', addImageProject)
  app.post('/user/:userId/project', createProject)
}
