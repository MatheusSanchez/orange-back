import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { createAndAuthenticateUser } from '../../utils/tests/create-and-authenticate-user'
import { randomUUID } from 'crypto'

let userAuth: {
  token: string
  userId: string
}

describe('Get User By Id E2E', () => {
  beforeAll(async () => {
    await app.ready()
    userAuth = await createAndAuthenticateUser(app)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get an user by ID', async () => {
    const getUserByIdResponse = await request(app.server)
      .get(`/user/${userAuth.userId}`)
      .set('Authorization', `Bearer ${userAuth.token}`)

    expect(getUserByIdResponse.statusCode).toEqual(200)
    expect(getUserByIdResponse.body.user).toEqual(
      expect.objectContaining({
        id: userAuth.userId,
        country: 'Brazil',
      }),
    )
  })

  it('should not be able to get an user by ID that does exists', async () => {
    const getUserByIdResponse = await request(app.server)
      .get(`/user/${randomUUID()}`)
      .set('Authorization', `Bearer ${userAuth.token}`)

    expect(getUserByIdResponse.statusCode).toEqual(404)
    expect(getUserByIdResponse.body.user).toEqual(expect.objectContaining({}))
  })

  it('should not be able to get an user requesting with id that is not uuid', async () => {
    const id = 'id_not_uuid'

    const getUserByIdResponse = await request(app.server)
      .get(`/user/${id}`)
      .set('Authorization', `Bearer ${userAuth.token}`)

    expect(getUserByIdResponse.statusCode).toEqual(400)

    expect(getUserByIdResponse.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        issues: expect.any(Object),
      }),
    )
  })
})
