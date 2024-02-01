import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PrismaProjectRepository } from '../../repositories/prisma/prisma-project-repository'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'
import { GetProjectsByIdUseCase } from '../../use-cases/project/getProjectsByIdUseCase'

export async function getProjectsById(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const projectRepository = new PrismaProjectRepository()
  const getProjectsByIdUseCase = new GetProjectsByIdUseCase(projectRepository)

  const GetProjectByIdParamsSchema = z.object({
    projectId: z.string().uuid(),
  })

  const { projectId } = GetProjectByIdParamsSchema.parse(request.params)

  try {
    const { project } = await getProjectsByIdUseCase.execute({ projectId })
    return response.status(200).send({ project })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return response.status(404).send({ error: 'Project was not Found !' })
    }
  }
}
