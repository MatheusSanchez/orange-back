import { expect, describe, it } from "vitest";
import { CreateUseCase } from "./createUseCase";
import { compare } from "bcryptjs";
import { InMemoryUserRepository } from "../repositories/in-memory-db/inMemoryUserRepository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUserRepository
    const createUseCase = new CreateUseCase(usersRepository)

    const { user } = await createUseCase.execute({
      name: 'John',
      surname: 'Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUserRepository
    const createUseCase = new CreateUseCase(usersRepository)

    const { user } = await createUseCase.execute({
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
    const usersRepository = new InMemoryUserRepository
    const createUseCase = new CreateUseCase(usersRepository)

    const email = 'johndoe@email.com'

    await createUseCase.execute({
      name: 'John',
      surname: 'Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      createUseCase.execute({
        name: 'John',
        surname: 'Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)

  })

})

