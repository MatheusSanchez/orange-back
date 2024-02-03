import { FastifyInstance } from 'fastify'
import { getUserById } from './getUserById'
import { getUserByEmail } from './getUserByEmail'
import { registerUser } from './registerUser'
import { editUserById } from './editUserById'
import { addImageUser } from './addImageToUser'
import FastifyMultipart from '@fastify/multipart'
import getUserByIdSchema from './Swagger/getUserByIdSchema.json'
import registerUserSchema from './Swagger/registerUserSchema.json'

export async function userRoutes(app: FastifyInstance) {
  app.register(FastifyMultipart, {
    limits: {
      files: 1,
      fileSize: 1000000, // the max file size in bytes
    },
  })
  app.post('/user', registerUserSchema, registerUser)
  app.get('/user/:id', getUserByIdSchema, getUserById)
  app.get('/user', getUserByEmail)
  app.put('/user/:userId/edit', editUserById)
  app.post('/user/:userId/photo', addImageUser)
}
