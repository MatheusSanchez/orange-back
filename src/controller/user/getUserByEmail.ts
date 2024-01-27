import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { GetUserByEmailUseCase } from '../../use-cases/getUserByEmailUseCase'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'

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

  const { user } = await getUserByEmailUseCase.execute({
    email,
  })

  return response.status(200).send({ user })
}
