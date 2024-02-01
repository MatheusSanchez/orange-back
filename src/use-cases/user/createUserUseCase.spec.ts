import { expect, describe, it, beforeEach } from 'vitest';
import { CreateUserUseCase } from '../user/createUserUseCase';
import { compare } from 'bcryptjs';
import { InMemoryUserRepository } from '../../repositories/in-memory-db/inMemoryUserRepository';
import { UserAlreadyExistsError } from '../errors/user-already-exists-error';
import { UserRepository } from '../../repositories/user-repository';

let usersRepository: UserRepository;
let createUserUseCase: CreateUserUseCase;

describe('Register Use Case', () => {
  
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })
  
  it('should be able to register', async () => {

    const { user } = await createUserUseCase.execute({
      name: 'John',
      surname: 'Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(user.email).toEqual('johndoe@email.com')
  })

  it('should hash user password upon registration', async () => {
    
    const { user } = await createUserUseCase.execute({
      name: 'John',
      surname: 'Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {

    const email = 'johndoe@email.com'

    await createUserUseCase.execute({
      name: 'John',
      surname: 'Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      createUserUseCase.execute({
        name: 'John',
        surname: 'Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)

  })

})
