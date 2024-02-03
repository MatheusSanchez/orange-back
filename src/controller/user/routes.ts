import { FastifyInstance } from 'fastify'
import { getUserById } from './getUserById'
import { getUserByEmail } from './getUserByEmail'
import { registerUser } from './registerUser'
import { editUserById } from './editUserById'

export async function userRoutes(app: FastifyInstance) {
  app.post('/user', registerUser)
  app.get('/user/:id', getUserById)
  app.get('/user', getUserByEmail)
  app.put('/user/:userId/edit', editUserById)
}
