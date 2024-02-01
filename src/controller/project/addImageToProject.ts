import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PrismaProjectRepository } from '../../repositories/prisma/prisma-project-repository'
import { AddImageToProjectUseCase } from '../../use-cases/addImageToProjectUseCase'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'
import { AwsS3Error } from '../../use-cases/errors/AwsS3Error'

export async function addImageProject(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const projectRepository = new PrismaProjectRepository()
  const addImageToProjectUseCase = new AddImageToProjectUseCase(
    projectRepository,
  )
  const addImageProjectParamsSchema = z.object({
    projectId: z.string().uuid(),
  })

  const { projectId } = addImageProjectParamsSchema.parse(request.params)
  const photo = await request.file()

  if (photo === undefined) {
    return response.status(400).send({ error: 'Fail load a photo!' })
  }

  try {
    const project = await addImageToProjectUseCase.execute({ projectId, photo })
    return response.status(200).send({ project })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return response.status(400).send({ error: 'Project was not found !' })
    } else if (error instanceof AwsS3Error) {
      return response.status(400).send({ error: error.message })
    }
    throw error
  }
}
