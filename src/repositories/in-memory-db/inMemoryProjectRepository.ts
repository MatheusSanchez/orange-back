import { randomUUID } from 'crypto'

import { Prisma, Project } from '@prisma/client'
import { ProjectRepository } from '../project-repository'
import { ProjectWithUserData } from '../prisma/prisma-project-with-user-data-type'
import { InMemoryUserRepository } from './inMemoryUserRepository'

export class InMemoryProjectRepository implements ProjectRepository {
  public dbProject: Project[] = []
  public dbUser: InMemoryUserRepository = new InMemoryUserRepository()

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
      photo_url: null,
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

  async fetchProjectById(
    projectId: string,
  ): Promise<ProjectWithUserData | null> {
    const project = this.dbProject.find((project) => project.id === projectId)

    if (!project) {
      return null
    }

    const {
      created_at,
      description,
      id,
      link,
      photo_url,
      tags,
      title,
      updated_at,
      user_id,
    } = project
    const foundUser = this.dbUser.db.find((user) => user.id === project.user_id)

    if (!foundUser) {
      return null
    }

    return {
      created_at,
      description,
      id,
      link,
      photo_url,
      tags,
      title,
      updated_at,
      user_id,
      user: {
        name: foundUser?.name,
        surname: foundUser?.surname,
        avatar_url: foundUser?.avatar_url,
      },
    }
  }

  async addPhotoUrl(projectId: string, photoUrl: string): Promise<Project> {
    throw new Error('Method not implemented.')
  }

  async deleteProjectByID(projectId: string): Promise<void> {
    const index = this.dbProject.findIndex(
      (project) => project.id === projectId,
    )

    if (index !== -1) {
      this.dbProject.splice(index, 1)
    }
  }

  async fetchProjectByTags(tags: string[]): Promise<ProjectWithUserData[]> {
    const projects = this.dbProject.filter((project) =>
      project.tags.some((tag) => tags.includes(tag)),
    )

    const projectPromises = projects.map(async (project) => {
      const user = await this.dbUser.findById(project.user_id)

      return {
        ...project,
        user: {
          name: user.name,
          surname: user.surname,
          avatar_url: user.avatar_url,
        },
      }
    })

    return Promise.all(projectPromises)
  }
}
