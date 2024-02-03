import { FastifyInstance } from 'fastify/types/instance'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/user').send({
    name: 'John',
    surname: 'Doe',
    email: 'johndoe@example.com',
    password: '12345678',
  })

  const authResponse = await request(app.server).post('/login').send({
    email: 'johndoe@example.com',
    password: '12345678',
  })

  const { token } = authResponse.body
  const { id: userId } = authResponse.body.user

  return { token, userId }
}
