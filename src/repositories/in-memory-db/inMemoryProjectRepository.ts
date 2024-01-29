import { randomUUID } from 'crypto'

import { Prisma, Project } from '@prisma/client'
import { ProjectRepository } from '../prisma/project-repository'

export class InMemoryProjectRepository implements ProjectRepository {
  public dbProject: Project[] = []

  constructor() {}

  async create(
    data: Prisma.ProjectCreateWithoutUserInput & { user_id: string },
  ): Promise<Project> {
    const project: Project = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description,
      tags: data.tags,
      link: data.link,
      user_id: data.user_id,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.dbProject.push(project)

    return project
  }
}
