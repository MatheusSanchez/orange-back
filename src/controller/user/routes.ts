import { FastifyInstance } from 'fastify'
import { getUserById } from './getUserById'
import { getUserByEmail } from './getUserByEmail'
import { registerUser } from './registerUser'
import registerUserSchema from './swagger/registerUserSchema.json'
import getUserByIdSchema from './swagger/getUserByIdSchema.json'

export async function userRoutes(app: FastifyInstance) {
  app.post('/user', registerUserSchema, registerUser)
  app.get('/user/:id', getUserByIdSchema, getUserById)
  app.get('/user', getUserByEmail)
}
