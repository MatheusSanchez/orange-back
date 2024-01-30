import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { app } from '../../app'
import request from 'supertest'

describe('User Login E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to login', async () => {
    const email = 'john_doe@email.com.br'
    const name = 'John'
    const surname = 'Doe'
    const password = 'password'

    await request(app.server).post('/user').send({
      email,
      name,
      surname,
      password,
    })

    const userData = await request(app.server)
      .post('/login')
      .send({ email, password })

    expect(userData.statusCode).toEqual(200)
    expect(userData.body).toEqual({
      user: expect.any(Object),
      token: expect.any(String),
    })
  })

  test('should not be able to login because the password is incorrect', async () => {
    const email = 'john_doe@email.com.br'
    const name = 'John'
    const surname = 'Doe'
    const password = 'password'
    const wrongPassword = 'wrongPassword'

    await request(app.server).post('/user').send({
      email,
      name,
      surname,
      password,
    })

    const userData = await request(app.server)
      .post('/login')
      .send({ email, password: wrongPassword })

    expect(userData.statusCode).toEqual(401)
    expect(userData.body.user).toEqual(expect.objectContaining({}))
  })

  test('should not be able to login because the email is incorrect', async () => {
    const email = 'john_doe@email.com.br'
    const wrongEmail = 'wrong@email.com.br'
    const name = 'John'
    const surname = 'Doe'
    const password = 'password'

    await request(app.server).post('/user').send({
      email,
      name,
      surname,
      password,
    })

    const userData = await request(app.server)
      .post('/login')
      .send({ email: wrongEmail, password })

    expect(userData.statusCode).toEqual(401)
    expect(userData.body.user).toEqual(expect.objectContaining({}))
  })
})
