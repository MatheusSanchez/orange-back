import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { GetUserByEmailUseCase } from '../../use-cases/getUserByEmailUseCase'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'

export async function getUserByEmail(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const userRepository = new PrismaUsersRepository()
  const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository)

  const getUserByEmailBodySchema = z.object({
    email: z.string().email(),
  })

  const { email } = getUserByEmailBodySchema.parse(request.query)

  try {
    const { user } = await getUserByEmailUseCase.execute({
      email,
    })
    return response.status(200).send({ user })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return response.status(404).send()
    }
  }
}
