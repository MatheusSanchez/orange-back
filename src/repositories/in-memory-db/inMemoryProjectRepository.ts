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
      tags: data.tags as string[],
      link: data.link,
      user_id: data.user_id,
      created_at: new Date(),
      updated_at: new Date(),
    }

    this.dbProject.push(project)

    return project
  }

  async edit(data: Prisma.ProjectUncheckedCreateInput): Promise<Project> {
    const indexToUpdate = this.dbProject.findIndex(
      (project) => project.id === data.id,
    )

    this.dbProject[indexToUpdate] = data as Project

    return this.dbProject[indexToUpdate]
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

  async fetchProjectByTags(tags: string[]): Promise<Project[]> {
    const projects = this.dbProject.filter((project) =>
      project.tags.some((tag) => tags.includes(tag)),
    )

    return projects
  }
}
