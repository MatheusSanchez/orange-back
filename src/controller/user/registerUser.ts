import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { CreateUserUseCase } from '../../use-cases/user/createUserUseCase'
import { UserAlreadyExistsError } from '../../use-cases/errors/user-already-exists-error'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'

export async function registerUser(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const registerBodySchema = z.object({
    name: z.string(),
    surname: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6),
    avatar_url: z.string().optional(),
    is_google: z.boolean().optional()
  })

  const { name, surname, email, password, avatar_url, is_google } = registerBodySchema.parse(
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
      avatar_url,
      is_google,
    })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return response.status(409).send({ message: error.message })
    }

    throw error
  }

  return response.status(201).send()
}
