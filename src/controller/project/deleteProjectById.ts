import { FastifyReply, FastifyRequest } from "fastify"
import { PrismaProjectRepository } from "../../repositories/prisma/prisma-project-repository"
import { DeleteProjectByIdUseCase } from "../../use-cases/project/deleteProjectByIdUseCase"
import { z } from "zod"

export async function deleteProjectById(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const projectRepository = new PrismaProjectRepository()
  const deleteProjectByIdUseCase = new DeleteProjectByIdUseCase(projectRepository)

  const DeleteProjectByIdParamsSchema = z.object({
    projectId: z.string().uuid(),
  })

  const { projectId } = DeleteProjectByIdParamsSchema.parse(request.params)

  try {
    await deleteProjectByIdUseCase.execute({ projectId })
    return response.status(200).send()
  } catch (error) {
    return response.status(404).send({ error: 'Unable to delete project !'})
  }
}