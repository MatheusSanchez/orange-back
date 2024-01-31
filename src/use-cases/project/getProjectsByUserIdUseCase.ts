import { Project } from '@prisma/client'

import { ProjectRepository } from '../../repositories/project-repository'
import { UserRepository } from '../../repositories/user-repository'

import { ResourceNotFoundError } from '../errors/ResourceNotFoundError'

interface FetchProjectsByUserIdUseCaseRequest {
  userId: string
}

interface FetchProjectsByUserIdUseCaseResponse {
  projects: Project[]
}

export class GetProjectsByUserIdUseCase {
  constructor(
    private projectRepository: ProjectRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    userId,
  }: FetchProjectsByUserIdUseCaseRequest): Promise<FetchProjectsByUserIdUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const projects = await this.projectRepository.fetchProjectsByUserId(userId)

    return {
      projects,
    }
  }
}
