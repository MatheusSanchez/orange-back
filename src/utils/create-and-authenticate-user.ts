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

  /*
    we won't need that in the future
    we need to adress this issue to remove this call to get the user id
    https://github.com/MatheusSanchez/orange-back/issues/50
  */
  const getUseByEmailResponse = await request(app.server)
    .get('/user')
    .query({ email: 'johndoe@example.com' })
    .set('Authorization', `Bearer ${token}`)

  const { id: userId } = getUseByEmailResponse.body.user

  return { token, userId }
}
