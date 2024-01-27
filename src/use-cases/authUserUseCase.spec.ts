import { describe, expect, beforeEach, it } from 'vitest'
import { InMemoryUserRepository } from '../repositories/in-memory-db/inMemoryUserRepository'
import { AuthUserUseCase } from './authUserUseCase'
import { compare, hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/InvalidCredentialsError'

let userRepository: InMemoryUserRepository
let authUserUseCase: AuthUserUseCase

describe('Get user by email and validate password', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    authUserUseCase = new AuthUserUseCase(userRepository)
  })

  it('should be able to validate the user login by comparing the email and password', async () => {
    const email = 'johndoe@email.com'
    const password = '12345'
    const name = 'John'
    const surname = 'Doe'

    const newUser = await userRepository.create({
      email,
      name,
      surname,
      password_hash: await hash(password, 6),
    })

    const { user } = await authUserUseCase.execute({ email, password })

    const passwordMatched = await compare(password, newUser.password_hash)

    expect(user.id).toEqual(newUser.id)
    expect(user.name).toEqual(name)
    expect(user.surname).toEqual(surname)
    expect(user.email).toEqual(email)
    expect(passwordMatched).toEqual(true)
  })

  it('return an error message if the password entered is not correct', async () => {
    const email = 'johndoe@email.com'
    const password = '12345'
    const name = 'John'
    const surname = 'Doe'

    await userRepository.create({
      email,
      name,
      surname,
      password_hash: await hash(password, 6),
    })

    const passwordIncorrect = 'password-incorrect'

    await expect(() =>
      authUserUseCase.execute({
        email,
        password: passwordIncorrect,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('return an error message if the email entered is not correct', async () => {
    const email = 'johndoe@email.com'
    const password = '12345'
    const name = 'John'
    const surname = 'Doe'

    await userRepository.create({
      email,
      name,
      surname,
      password_hash: await hash(password, 6),
    })

    const emailIncorrect = 'email-incorrect@email.com'

    await expect(() =>
      authUserUseCase.execute({
        email: emailIncorrect,
        password,
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
