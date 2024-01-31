import { Project } from '@prisma/client'

import { ProjectRepository } from '../repositories/project-repository'
import { UserRepository } from '../repositories/user-repository'

import { ResourceNotFoundError } from './errors/ResourceNotFoundError'

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
  constructor(
    private projectRepository: ProjectRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    title,
    description,
    tags,
    link,
    userId,
  }: CreateProjectUseCaseRequest): Promise<CreateProjectUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const lowercaseTags = tags.toLowerCase();

    const project = await this.projectRepository.create({
      title,
      description,
      tags: lowercaseTags,
      link,
      user_id: userId,
    })

    return {
      project,
    }
  }
}
