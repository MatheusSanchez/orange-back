import { Project } from '@prisma/client'

import { ProjectRepository } from '../repositories/prisma/project-repository'

interface CreateProjectUseCaseRequest {
  title: string
  description: string
  tags: string
  link: string
  userId: string
}

interface CreateProjectUseCaseResponse {
  project: Project
}

export class CreateProjectUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    title,
    description,
    tags,
    link,
    userId,
  }: CreateProjectUseCaseRequest): Promise<CreateProjectUseCaseResponse> {
    const project = await this.projectRepository.create(
      {
        title,
        description,
        tags,
        link,
      },
      userId,
    )

    return {
      project,
    }
  }
}
