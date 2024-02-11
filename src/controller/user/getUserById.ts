import { FastifyReply, FastifyRequest } from 'fastify'
import { GetUserByIdUseCase } from '../../use-cases/user/getUserByIdUseCase'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'

export async function getUserById(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const userRepository = new PrismaUsersRepository()
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository)

  const { user } = await getUserByIdUseCase.execute({
    id: request.user.sub,
  })
  return response
    .status(200)
    .send({ user: { ...user, password_hash: undefined } })
}
