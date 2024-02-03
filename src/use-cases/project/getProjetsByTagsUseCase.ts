import { ProjectRepository } from '../../repositories/project-repository'

import { ProjectWithUserData } from '../../repositories/prisma/prisma-project-with-user-data-type'

interface GetProjectsByTagsRequest {
  projectTags: string[]
}

interface GetProjectsByTagsResponse {
  projects: ProjectWithUserData[]
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
