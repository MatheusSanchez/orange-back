import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { compare } from 'bcryptjs'

describe('Get User By email E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to get an user by e-mail', async () => {
    const email = 'john_doe@email.com'
    const name = 'John'
    const surname = 'Doe'
    const password = 'password'

    await request(app.server).post('/user').send({
      email,
      name,
      surname,
      password,
    })

    const getUserByEmailResponse = await request(app.server)
      .get(`/user`)
      .query({ email })

    expect(getUserByEmailResponse.statusCode).toEqual(200)
    expect(getUserByEmailResponse.body.user).toEqual(
      expect.objectContaining({
        email,
        name,
        surname,
        password_hash: expect.any(String),
        country: 'brasil',
      }),
    )

    const passwordMatches = await compare(
      password,
      getUserByEmailResponse.body.user.password_hash,
    )
    expect(passwordMatches).toEqual(true)
  })

  test('should not be able to get an user by e-mail that does not exist', async () => {
    const email = 'userwasnotregistered@email.com'

    const getUserByEmailResponse = await request(app.server)
      .get(`/user`)
      .query({ email })

    expect(getUserByEmailResponse.statusCode).toEqual(404)
    expect(getUserByEmailResponse.body.user).toEqual(
      expect.objectContaining({}),
    )
  })
})
