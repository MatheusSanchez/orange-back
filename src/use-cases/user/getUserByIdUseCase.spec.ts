import { InMemoryUserRepository } from '../../repositories/in-memory-db/inMemoryUserRepository'
import { describe, expect, beforeEach, it } from 'vitest'
import { hash } from 'bcryptjs'
import { GetUserByIdUseCase } from './getUserByIdUseCase'
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError'

let userRepository: InMemoryUserRepository

let getUserByIdUseCase: GetUserByIdUseCase

describe('Get User By Id Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    getUserByIdUseCase = new GetUserByIdUseCase(userRepository)
  })

  it('should be able to get user by Id', async () => {
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

    const { user } = await getUserByIdUseCase.execute({ id: newUser.id })

    expect(user.id).toEqual(newUser.id)
    expect(user.name).toEqual(name)
    expect(user.surname).toEqual(surname)
    expect(user.email).toEqual(email)
    expect(user.country).toEqual('brasil')
  })

  it('should not be able to get user that does not exists', async () => {
    await expect(() =>
      getUserByIdUseCase.execute({
        id: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
