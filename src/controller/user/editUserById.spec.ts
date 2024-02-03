import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { randomUUID } from 'crypto'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { UserRepository } from '../../repositories/user-repository'
import { createAndAuthenticateUser } from '../../utils/create-and-authenticate-user'

let userRepository: UserRepository

let userAuth: {
  token: string
  userId: string
}

describe('edit User E2E', () => {
  beforeAll(async () => {
    userRepository = new PrismaUsersRepository()
    await app.ready()
    userAuth = await createAndAuthenticateUser(app)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to edit a user', async () => {
    const editUserResponse = await request(app.server)
      .put(`/user/${userAuth.userId}/edit`)
      .send({
        name: 'newName',
        surname: 'surname',
        country: 'country',
      })
      .set('Authorization', `Bearer ${userAuth.token}`)

    expect(editUserResponse.statusCode).toEqual(200)
    expect(editUserResponse.body.user).toEqual(
      expect.objectContaining({
        name: 'newName',
        surname: 'surname',
        country: 'country',
        id: userAuth.userId,
      }),
    )
  })

  it('should not be able to edit a user that does not exist', async () => {
    const editUserResponse = await request(app.server)
      .put(`/user/${randomUUID()}/edit`)
      .set('Authorization', `Bearer ${userAuth.token}`)
      .send({
        name: 'newName',
        surname: 'surname',
        country: 'country',
      })

    expect(editUserResponse.statusCode).toEqual(404)

    expect(editUserResponse.body).toEqual(
      expect.objectContaining({
        error: 'User was not Found !',
      }),
    )
  })
})
