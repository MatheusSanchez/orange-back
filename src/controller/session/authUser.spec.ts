import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { app } from '../../app'
import request from 'supertest'
import { createAndAuthenticateUser } from '../../utils/tests/create-and-authenticate-user'
let userAuth: {
  token: string
  userId: string
}
describe('User Login E2E', () => {
  beforeAll(async () => {
    await app.ready()
    userAuth = await createAndAuthenticateUser(app)
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to login', async () => {
    const email = 'johndoe@example.com'
    const password = '12345678'

    const userData = await request(app.server)
      .post('/login')
      .send({ email, password })

    expect(userData.statusCode).toEqual(200)
    expect(userData.body).toEqual({
      token: userAuth.token,
    })
  })

  test('should not be able to login because the password is incorrect', async () => {
    const email = 'johndoe@example.com'
    const password = 'wrongpass'
    const userData = await request(app.server)
      .post('/login')
      .send({ email, password })

    expect(userData.statusCode).toEqual(401)
    expect(userData.body.user).toEqual(expect.objectContaining({}))
  })

  test('should not be able to login because the email is incorrect', async () => {
    const email = 'wrongemail@example.com'
    const password = '12345678'

    const userData = await request(app.server)
      .post('/login')
      .send({ email, password })

    expect(userData.statusCode).toEqual(401)
    expect(userData.body.user).toEqual(expect.objectContaining({}))
  })
})
