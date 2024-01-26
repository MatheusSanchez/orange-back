import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { UserRepository } from '../../repositories/user-repository'

let userRepository: UserRepository

describe('Get User By Id E2E', () => {
  beforeAll(async () => {
    userRepository = new PrismaUsersRepository()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get an user by ID', async () => {
    const id = '9600de4f-8d18-4e69-ba7a-ed7fa210618d'
    const email = 'john_doe@email.com'
    const name = 'John'
    const surname = 'Doe'
    const password_hash = '9600de4f-8d18-4e69-ba7a-ed7fa210618d'

    await userRepository.create({ email, id, name, surname, password_hash })

    const getUserByIdResponse = await request(app.server).get(`/user/${id}`)

    expect(getUserByIdResponse.statusCode).toEqual(200)
    expect(getUserByIdResponse.body.user).toEqual(
      expect.objectContaining({
        id,
      }),
    )
  })

  it('should not be able to get an user by ID that does exists', async () => {
    const id = '9999de4f-8d18-4e69-ba7a-ed7fa210618d'

    const getUserByIdResponse = await request(app.server).get(`/user/${id}`)

    expect(getUserByIdResponse.statusCode).toEqual(404)
    expect(getUserByIdResponse.body.user).toEqual(expect.objectContaining({}))
  })

  it('should not be able to get an user requesting with id that is not uuid', async () => {
    const id = 'id_not_uuid'

    const getUserByIdResponse = await request(app.server).get(`/user/${id}`)
    expect(getUserByIdResponse.statusCode).toEqual(400)

    expect(getUserByIdResponse.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        issues: expect.any(Object),
      }),
    )
  })
})
