import { Project } from '@prisma/client'

import { ProjectRepository } from '../repositories/project-repository'

import { ResourceNotFoundError } from './errors/ResourceNotFoundError'

interface GetProjectByTagsRequest {
  projectTags: string
}

interface GetProjectByTagsResponse {
  projects: Project[]
}

export class GetProjectsByTagsUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    projectTags,
  }: GetProjectByTagsRequest): Promise<GetProjectByTagsResponse> {
    const projects = await this.projectRepository.fetchProjectByTags(projectTags)

    if (!projects) {
      throw new ResourceNotFoundError()
    }

    return {
      projects
    }
  }
}