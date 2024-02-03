import { FastifyInstance } from 'fastify'
import { createProject } from './createProject'
import { getProjectsByUserId } from './getProjectsByUserId'
import { getProjectsById } from './getProjectById'
import { addImageProject } from './addImageToProject'
import FastifyMultipart from '@fastify/multipart'
import path from 'path'
import fastifyStatic from '@fastify/static'
import { getProjectsByTags } from './getProjectsByTags'
import { editProject } from './editProjectById'
import { deleteProjectById } from './deleteProjectById'
import getProjectByUserIdSchema from './swagger/getProjectsByUserIdSwagger.json'
import getProjectByIdSchema from './swagger/getProjectByIDSwagger.json'
import createProjectSwagger from './swagger/createProjectSwagger.json'

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

  app.post('/projects/tags', getProjectsByTags)
  app.get('/projects/:userId', getProjectByUserIdSchema, getProjectsByUserId)
  app.get('/project/:projectId', getProjectByIdSchema, getProjectsById)

  app.post('/project/:projectId/photo', addImageProject)
  app.post('/user/:userId/project', createProjectSwagger, createProject)

  app.put('/project/:projectId/edit', editProject)
  app.delete('/project/:projectId', deleteProjectById)
}
