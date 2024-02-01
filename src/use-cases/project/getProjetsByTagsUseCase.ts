import { Project } from '@prisma/client'

import { ProjectRepository } from '../../repositories/project-repository'

import { ResourceNotFoundError } from '../errors/ResourceNotFoundError'

interface GetProjectsByTagsRequest {
  projectTags: string[]
}

interface GetProjectsByTagsResponse {
  projects: Project[]
}

export class GetProjectsByTagsUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    projectTags,
  }: GetProjectsByTagsRequest): Promise<GetProjectsByTagsResponse> {
    const lowercaseTags = projectTags.map((tag) => tag.toLowerCase())

    const projects =
      await this.projectRepository.fetchProjectByTags(lowercaseTags)

    return {
      projects,
    }
  }
}
