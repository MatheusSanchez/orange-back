import { InMemoryUserRepository } from '../../repositories/in-memory-db/inMemoryUserRepository'
import { describe, expect, beforeEach, it } from 'vitest'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError'
import { GetUserByEmailUseCase } from '../user/getUserByEmailUseCase'

let userRepository: InMemoryUserRepository

let getUserByEmailUseCase: GetUserByEmailUseCase

describe('Get User By Email Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository)
  })

  it('should be able to get user by email', async () => {
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

    const { user } = await getUserByEmailUseCase.execute({
      email: newUser.email,
    })

    expect(user.id).toEqual(newUser.id)
    expect(user.name).toEqual(name)
    expect(user.surname).toEqual(surname)
    expect(user.email).toEqual(email)
    expect(user.country).toEqual('brasil')
  })

  it('should not be able to get user that does not exists', async () => {
    await expect(() =>
      getUserByEmailUseCase.execute({
        email: 'non-existing-email',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
