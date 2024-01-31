import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PrismaProjectRepository } from '../../repositories/prisma/prisma-project-repository'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'
import { EditProjectUseCase } from '../../use-cases/project/editProjectUseCase'

export async function editProject(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const editProjectBodySchema = z.object({
    title: z.string(),
    tags: z.array(z.string()),
    link: z.string(),
    description: z.string(),
  })

  const editProjectParamsSchema = z.object({
    projectId: z.string().uuid(),
  })

  const { title, tags, link, description } = editProjectBodySchema.parse(
    request.body,
  )
  const { projectId } = editProjectParamsSchema.parse(request.params)

  const projectRepository = new PrismaProjectRepository()
  const editProjectUseCase = new EditProjectUseCase(projectRepository)

  try {
    const { project } = await editProjectUseCase.execute({
      projectId,
      title,
      tags,
      link,
      description,
    })

    return response.status(200).send({ project })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return response.status(404).send({ error: 'Project was not Found !' })
    }
  }
}
