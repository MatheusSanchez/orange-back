import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { GetProjectsByUserIdUseCase } from '../../use-cases/project/getProjectsByUserIdUseCase'
import { PrismaProjectRepository } from '../../repositories/prisma/prisma-project-repository'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'

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

  const GetProjectByUserIdParamsSchema = z.object({
    userId: z.string().uuid(),
  })

  const { userId } = GetProjectByUserIdParamsSchema.parse(request.params)

  try {
    const { projects } = await getProjectByUserId.execute({ userId })
    return response.status(200).send({ projects })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return response.status(404).send({ error: 'User was not Found !' })
    }
  }
}
