import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { GetUserByIdUseCase } from '../../use-cases/user/getUserByIdUseCase'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'

export async function getUserById(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const userRepository = new PrismaUsersRepository()
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository)

  const getUserByIdBodySchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = getUserByIdBodySchema.parse(request.params)

  try {
    const { user } = await getUserByIdUseCase.execute({
      id,
    })
    return response.status(200).send({ user })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return response.status(404).send()
    }
  }
}
