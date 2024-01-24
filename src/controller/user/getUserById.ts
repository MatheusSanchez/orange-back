import { FastifyReply, FastifyRequest } from 'fastify'
import { InMemoryUserRepository } from '../../repositories/in-memory-db/inMemoryUserRepository'
import { z } from 'zod'
import { GetUserByIdUseCase } from '../../use-cases/getUserByIdUseCase'

export async function getUserById(
  request: FastifyRequest,
  response: FastifyReply,
) {
  
  const userRepository = new InMemoryUserRepository()
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository)

  const getUserByIdBodySchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = getUserByIdBodySchema.parse(request.params)

  const { user } = await getUserByIdUseCase.execute({
    id,
  })

  return response.status(200).send({ user })
}
