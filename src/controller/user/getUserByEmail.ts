import { FastifyReply, FastifyRequest } from 'fastify'
import { InMemoryUserRepository } from '../../repositories/in-memory-db/inMemoryUserRepository'
import { z } from 'zod'
import { GetUserByEmailUseCase } from '../../use-cases/getUserByEmailUseCase'

export async function getUserByEmail(
  request: FastifyRequest,
  response: FastifyReply,
) {
  
  const userRepository = new InMemoryUserRepository()
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
