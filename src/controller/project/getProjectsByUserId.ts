import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { GetProjectsByUserIdUseCase } from '../../use-cases/project/getProjectsByUserIdUseCase'
import { PrismaProjectRepository } from '../../repositories/prisma/prisma-project-repository'

export async function getProjectsByUserId(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const userRepository = new PrismaUsersRepository()
  const projectRepository = new PrismaProjectRepository()
  const getProjectByUserId = new GetProjectsByUserIdUseCase(
    projectRepository,
    userRepository,
  )

  const { projects } = await getProjectByUserId.execute({
    userId: request.user.sub,
  })
  return response.status(200).send({ projects })
}
