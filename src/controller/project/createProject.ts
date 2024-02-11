import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { CreateProjectUseCase } from '../../use-cases/project/createProjectUseCase'
import { PrismaProjectRepository } from '../../repositories/prisma/prisma-project-repository'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'

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

  const { title, tags, link, description } = createProjectBodySchema.parse(
    request.body,
  )
  const userRepository = new PrismaUsersRepository()
  const projectRepository = new PrismaProjectRepository()
  const createProjectUseCase = new CreateProjectUseCase(
    projectRepository,
    userRepository,
  )

  const { project } = await createProjectUseCase.execute({
    userId: request.user.sub,
    title,
    tags,
    link,
    description,
  })

  return response.status(201).send({ project })
}
