import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { randomUUID } from 'crypto'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { UserRepository } from '../../repositories/user-repository'

let userRepository: UserRepository

describe('edit User E2E', () => {
  beforeAll(async () => {
    userRepository = new PrismaUsersRepository()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to edit a user', async () => {
    const email = 'john_doe@email.com'
    const name = 'John'
    const surname = 'Doe'
    const password_hash = 'password_hash'

    const newUser = await userRepository.create({
      email,
      name,
      surname,
      password_hash,
    })

    const editUserResponse = await request(app.server)
      .put(`/user/${newUser.id}/edit`)
      .send({
        name: 'newName',
        surname: 'surname',
        country: 'country',
      })

    expect(editUserResponse.statusCode).toEqual(200)
    expect(editUserResponse.body.user).toEqual(
      expect.objectContaining({
        name: 'newName',
        surname: 'surname',
        country: 'country',
        id: newUser.id,
        email,
        password_hash,
      }),
    )
  })

  it('should not be able to edit a user that does not exist', async () => {
    const editUserResponse = await request(app.server)
      .put(`/user/${randomUUID()}/edit`)
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
