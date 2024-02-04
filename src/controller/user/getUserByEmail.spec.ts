import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { createAndAuthenticateUser } from '../../utils/tests/create-and-authenticate-user'

let userAuth: {
  token: string
  userId: string
}

describe('Get User By email E2E', () => {
  beforeAll(async () => {
    await app.ready()
    userAuth = await createAndAuthenticateUser(app)
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to get an user by e-mail', async () => {
    const getUserByEmailResponse = await request(app.server)
      .get(`/user`)
      .query({ email: 'johndoe@example.com' })
      .set('Authorization', `Bearer ${userAuth.token}`)

    expect(getUserByEmailResponse.statusCode).toEqual(200)
    expect(getUserByEmailResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'johndoe@example.com',
        id: userAuth.userId,
        country: 'brasil',
      }),
    )
  })

  test('should not be able to get an user by e-mail that does not exist', async () => {
    const email = 'userwasnotregistered@email.com'

    const getUserByEmailResponse = await request(app.server)
      .get(`/user`)
      .query({ email })
      .set('Authorization', `Bearer ${userAuth.token}`)

    expect(getUserByEmailResponse.statusCode).toEqual(404)
    expect(getUserByEmailResponse.body.user).toEqual(
      expect.objectContaining({}),
    )
  })
})
