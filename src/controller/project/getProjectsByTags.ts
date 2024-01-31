import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PrismaProjectRepository } from '../../repositories/prisma/prisma-project-repository'
import { GetProjectsByTagsUseCase } from '../../use-cases/getProjetsByTagsUseCase'

export async function getProjectsByTags(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const projectRepository = new PrismaProjectRepository()
  const getProjectsByTagsUseCase = new GetProjectsByTagsUseCase(
    projectRepository,
  )

  const GetProjectByTagsBodySchema = z.object({
    tags: z.array(z.string()),
  })
  const { tags } = GetProjectByTagsBodySchema.parse(request.body)

  const { projects } = await getProjectsByTagsUseCase.execute({
    projectTags: tags,
  })
  return response.status(200).send({ projects })
}
