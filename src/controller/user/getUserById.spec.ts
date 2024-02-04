import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { createAndAuthenticateUser } from '../../utils/create-and-authenticate-user'

describe('Get User By Id E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get an user by ID', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const getUserByIdResponse = await request(app.server)
      .get(`/user`)
      .set('Authorization', `Bearer ${token}`)

    expect(getUserByIdResponse.statusCode).toEqual(200)
    expect(getUserByIdResponse.body.user).toEqual(
      expect.objectContaining({
        country: 'brasil',
        name: 'John',
        surname: 'Doe',
        email: 'johndoe@example.com',
      }),
    )
  })

  it('should not be able to get an user without authenticate', async () => {
    const getUserByIdResponse = await request(app.server).get(`/user`)

    expect(getUserByIdResponse.statusCode).toEqual(401)
    expect(getUserByIdResponse.body).toEqual(
      expect.objectContaining({ message: 'Unauthorized' }),
    )
  })
})
