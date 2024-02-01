import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { CreateProjectUseCase } from '../../use-cases/project/createProjectUseCase'
import { PrismaProjectRepository } from '../../repositories/prisma/prisma-project-repository'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'

export async function createProject(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const createProjectBodySchema = z.object({
    title: z.string(),
    tags: z.array(z.string()),
    link: z.string(),
    description: z.string(),
  })

  const createProjectParamsSchema = z.object({
    userId: z.string().uuid(),
  })

  const { title, tags, link, description } = createProjectBodySchema.parse(
    request.body,
  )
  const { userId } = createProjectParamsSchema.parse(request.params)

  const userRepository = new PrismaUsersRepository()
  const projectRepository = new PrismaProjectRepository()
  const createProjectUseCase = new CreateProjectUseCase(
    projectRepository,
    userRepository,
  )
  try {
    const { project } = await createProjectUseCase.execute({
      userId,
      title,
      tags,
      link,
      description,
    })

    return response.status(201).send({ project })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return response.status(404).send({ message: 'User was not Found !' })
    }

    throw error
  }
}
