import { expect, describe, it, beforeEach } from 'vitest'
import { CreateUserUseCase } from './createUserUseCase'
import { compare } from 'bcryptjs'
import { InMemoryUserRepository } from '../../repositories/in-memory-db/inMemoryUserRepository'
import { UserRepository } from '../../repositories/user-repository'
import { EditUserPasswordUseCase } from './editUserPasswordUseCase'
import { InvalidCredentialsError } from '../errors/InvalidCredentialsError'
import { randomUUID } from 'crypto'
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError'

let usersRepository: UserRepository
let editUserPasswordUseCase: EditUserPasswordUseCase
let createUserUseCase: CreateUserUseCase

describe('Edit User Pass Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository()
    editUserPasswordUseCase = new EditUserPasswordUseCase(usersRepository)
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it('should be able to edit a user pass', async () => {
    const { user } = await createUserUseCase.execute({
      name: 'John',
      surname: 'Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    const { user: editedPassUser } = await editUserPasswordUseCase.execute({
      userId: user.id,
      newPassword: 'newAwesomePass',
      oldPassword: '123456',
    })

    expect(editedPassUser.email).toEqual('johndoe@email.com')
    expect(editedPassUser.name).toEqual('John')

    const isPasswordCorrectlyHashed = await compare(
      'newAwesomePass',
      editedPassUser.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to edit an user pass with the wrong old pass', async () => {
    const { user } = await createUserUseCase.execute({
      name: 'John',
      surname: 'Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    await expect(() =>
      editUserPasswordUseCase.execute({
        userId: user.id,
        newPassword: 'newAwesomePass',
        oldPassword: 'oldWrongPass',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to edit an user pass from an user that does not exist', async () => {
    await expect(() =>
      editUserPasswordUseCase.execute({
        userId: randomUUID(),
        newPassword: 'newAwesomePass',
        oldPassword: 'oldWrongPass',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
