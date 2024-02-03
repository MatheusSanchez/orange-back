import { ProjectRepository } from '../../repositories/project-repository'

import { ResourceNotFoundError } from '../errors/ResourceNotFoundError'
import { ProjectWithUserData } from '../../repositories/prisma/prisma-project-with-user-data-type'

interface GetProjectByIdRequest {
  projectId: string
}

interface GetProjectByIdResponse {
  project: ProjectWithUserData
}

export class GetProjectsByIdUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    projectId,
  }: GetProjectByIdRequest): Promise<GetProjectByIdResponse> {
    const project = await this.projectRepository.fetchProjectById(projectId)

    if (!project) {
      throw new ResourceNotFoundError()
    }

    return {
      project,
    }
  }
}
