import { Project } from '@prisma/client'

import { ProjectRepository } from '../../repositories/project-repository'

import { ResourceNotFoundError } from '../errors/ResourceNotFoundError'

interface EditProjectUseCaseRequest {
  title: string
  description: string
  tags: string[]
  link: string
  projectId: string
}

interface EditProjectUseCaseResponse {
  project: Project
}

export class EditProjectUseCase {
  constructor(private projectRepository: ProjectRepository) {}

  async execute({
    title,
    description,
    link,
    tags,
    projectId,
  }: EditProjectUseCaseRequest): Promise<EditProjectUseCaseResponse> {
    const projectToBeUpdated =
      await this.projectRepository.fetchProjectById(projectId)

    if (!projectToBeUpdated) {
      throw new ResourceNotFoundError()
    }

    const project = await this.projectRepository.edit({
      id: projectId,
      title,
      tags,
      link,
      description,
      user_id: projectToBeUpdated.user_id,
    })

    return {
      project,
    }
  }
}
