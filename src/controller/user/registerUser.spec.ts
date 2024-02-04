import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { compare } from 'bcryptjs'
import { UserRepository } from '../../repositories/user-repository'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'

let userRepository: UserRepository

describe('Register User E2E', () => {
  beforeAll(async () => {
    userRepository = new PrismaUsersRepository()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register a new user', async () => {
    const email = 'john_doe@email.com'
    const name = 'John'
    const surname = 'Doe'
    const password = 'password'
    const avatar_url = 'avatar_url'

    const is_google = true

    const registerUserResponse = await request(app.server).post('/user').send({
      email,
      name,
      surname,
      password,
      avatar_url,
      is_google,
    })

    const userFoundedDb = await userRepository.findByEmail(email)

    expect(registerUserResponse.statusCode).toEqual(201)
    expect(userFoundedDb).not.toBeNull()
    expect(userFoundedDb).toEqual(
      expect.objectContaining({
        email,
        avatar_url,
        is_google,
      }),
    )

    const passwordMatches = await compare(password, userFoundedDb.password_hash)
    expect(passwordMatches).toEqual(true)
  })

  it('should be able to register a new user without avatar_url and without surname', async () => {
    const email = 'john_doe2@email.com'
    const name = 'John'
    const password = 'password'

    const registerUserResponse = await request(app.server).post('/user').send({
      email,
      name,
      password,
    })

    const userFoundedDb = await userRepository.findByEmail(email)

    expect(registerUserResponse.statusCode).toEqual(201)
    expect(userFoundedDb).not.toBeNull()
    expect(userFoundedDb).toEqual(
      expect.objectContaining({
        email,
        is_google: false,
        avatar_url:
          'https://orangeapp-contents-prod.s3.amazonaws.com/avatar1.png',
      }),
    )

    const passwordMatches = await compare(password, userFoundedDb.password_hash)
    expect(passwordMatches).toEqual(true)
  })

  it('should not be able to register a new user, with an email already registered', async () => {
    const email = 'john_doe@email.com'
    const name = 'John'
    const surname = 'Doe'
    const password = 'password'

    // Since the databases are set up once per file, we don't need to insert a new user before this line;
    // The user inserted in the test above is still in the database.
    const registerUserResponse = await request(app.server).post('/user').send({
      email,
      name,
      surname,
      password,
    })

    expect(registerUserResponse.statusCode).toEqual(409)

    expect(registerUserResponse.body).toEqual(
      expect.objectContaining({
        message: 'E-mail already exists.',
      }),
    )
  })
})
