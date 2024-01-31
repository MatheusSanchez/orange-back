import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaProjectRepository } from "../../repositories/prisma/prisma-project-repository";
import { GetProjectsByTagsUseCase } from "../../use-cases/getProjectsByTagsUseCase";
import { z } from "zod";
import { ResourceNotFoundError } from "../../use-cases/errors/ResourceNotFoundError";


export async function getProjectsByTags(
  request: FastifyRequest,
  response: FastifyReply
) {
  const projectRepository = new PrismaProjectRepository()
  const getProjectsByTagsUseCase = new GetProjectsByTagsUseCase(projectRepository)

  const GetProjectsByTagsParamsSchema = z.object({
    projectTags: z.string()
  })

  const { projectTags } = GetProjectsByTagsParamsSchema.parse(request.params)

  try {
    const { projects } = await getProjectsByTagsUseCase.execute({ projectTags })
    return response.status(200).send({ projects })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return response.status(404).send({ error: 'Project was not Found!'})
    }
  }
} 