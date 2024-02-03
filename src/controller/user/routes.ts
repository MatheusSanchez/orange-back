import { FastifyInstance } from 'fastify'
import { getUserById } from './getUserById'
import { getUserByEmail } from './getUserByEmail'
import { registerUser } from './registerUser'
import registerUserDoc from './Swagger/registerUserDoc.json'

export async function userRoutes(app: FastifyInstance) {
  app.post('/user', {
    ...registerUserDoc,
    handler: registerUser,
  })
  app.get('/user/:id', getUserById)
  app.get('/user', getUserByEmail)
}
