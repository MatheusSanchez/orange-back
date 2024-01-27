import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { CreateUserUseCase } from '../../use-cases/createUserUseCase'
import { UserAlreadyExistsError } from '../../use-cases/errors/user-already-exists-error'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'

export async function registerUser(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    surname: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, surname, email, password } = registerBodySchema.parse(
    request.body,
  )

  const usersRepository = new PrismaUsersRepository()
  const createUserUseCase = new CreateUserUseCase(usersRepository)
  try {
    await createUserUseCase.execute({
      name,
      surname,
      email,
      password,
    })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return response.status(409).send({ message: error.message })
    }

    throw error
  }

  return response.status(201).send()
}
