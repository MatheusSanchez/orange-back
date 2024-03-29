import { FastifyInstance } from 'fastify'
import { getUserById } from './getUserById'
import { getUserByEmail } from './getUserByEmail'
import { registerUser } from './registerUser'
import { editUserById } from './editUserById'
import { addImageUser } from './addImageToUser'
import FastifyMultipart from '@fastify/multipart'
import { verifyJWT } from '../middlewares/verifyJwt'
import { editUserPassword } from './editUserPassword'

export async function userRoutes(app: FastifyInstance) {
  app.register(FastifyMultipart, {
    limits: {
      files: 1,
      fileSize: 1000000, // the max file size in bytes
    },
  })
  app.post('/user', registerUser)
  app.get('/user/:id', { onRequest: verifyJWT }, getUserById)
  app.get('/user', getUserByEmail)
  app.put('/user/:userId/edit', { onRequest: verifyJWT }, editUserById)
  app.put('/user/edit/pass', { onRequest: verifyJWT }, editUserPassword)

  app.post('/user/:userId/photo', { onRequest: verifyJWT }, addImageUser)
}
