import { Project } from '@prisma/client'

import { ProjectRepository } from '../repositories/project-repository'

import { ResourceNotFoundError } from './errors/ResourceNotFoundError'

interface GetProjectByIdRequest {
  projectId: string
}

interface GetProjectByIdResponse {
  project: Project
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
