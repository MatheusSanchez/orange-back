import { randomUUID } from 'crypto'

import { Prisma, Project } from '@prisma/client'
import { ProjectRepository } from '../prisma/project-repository'

export class InMemoryProjectRepository implements ProjectRepository {
  public dbProject: Project[] = []

  constructor() {
    const project: Prisma.ProjectCreateWithoutUserInput = {
      title: 'React',
      description: 'Novo',
      tags: 'nov, nn',
      link: 'https:',
    }

    const userId = '1'

    this.create(project, userId)
  }

  async findById(id: string) {
    const project = this.dbProject.find((project) => project.id === id)

    return !project ? null : project
  }

  async create(
    data: Prisma.ProjectCreateWithoutUserInput,
    userId: string,
  ): Promise<Project> {
    const project: Project = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description,
      tags: data.tags,
      link: data.link,
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.dbProject.push(project)

    return project
  }
}
