import { randomUUID } from 'crypto'

import { Prisma, Project } from '@prisma/client'
import { ProjectRepository } from '../project-repository'

export class InMemoryProjectRepository implements ProjectRepository {
  public dbProject: Project[] = []

  constructor() {}

  async create(data: Prisma.ProjectUncheckedCreateInput): Promise<Project> {
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

  async fetchProjectsByUserId(userId: string): Promise<Project[]> {
    const projects = this.dbProject.filter(
      (project) => project.user_id === userId,
    )

    return projects
  }

  async fetchProjectById(projectId: string): Promise<Project | null> {
    const project = this.dbProject.find((project) => project.id === projectId)
    if (!project) {
      return null
    }
    return project
  }

  async addPhotoUrl(projectId: string, photoUrl: string): Promise<Project> {
    throw new Error('Method not implemented.')
  }
}
