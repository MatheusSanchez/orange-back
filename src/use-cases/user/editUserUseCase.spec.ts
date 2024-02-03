import { expect, describe, it, beforeEach } from 'vitest'

import { ResourceNotFoundError } from '../errors/ResourceNotFoundError'
import { InMemoryUserRepository } from '../../repositories/in-memory-db/inMemoryUserRepository'
import { EditUserUseCase } from './editUserUseCase'

let userRepository: InMemoryUserRepository

let editUserUseCase: EditUserUseCase

describe('Edit Project By Id Use Case', () => {
  beforeEach(async () => {
    userRepository = new InMemoryUserRepository()
    editUserUseCase = new EditUserUseCase(userRepository)
  })

  it('should be able edit one user by ID', async () => {
    const userToBeEdited = await userRepository.create({
      name: 'John',
      surname: 'Doe',
      email: 'johndoe@email.com',
      password_hash: '123456',
    })

    const { user } = await editUserUseCase.execute({
      name: 'newCoolName',
      surname: 'newSurCoolName',
      country: 'differentCountry',
      userId: userToBeEdited.id,
    })

    expect(user).toEqual(
      expect.objectContaining({
        name: 'newCoolName',
        surname: 'newSurCoolName',
        country: 'differentCountry',
        email: 'johndoe@email.com',
        password_hash: '123456',
        id: userToBeEdited.id,
      }),
    )
  })

  it('should not be able to edit a user that does not exist', async () => {
    await expect(() =>
      editUserUseCase.execute({
        name: 'newCoolName',
        surname: 'newSurCoolName',
        country: 'differentCountry',
        userId: 'not-exist-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
