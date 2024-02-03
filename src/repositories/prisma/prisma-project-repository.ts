import { Prisma, Project } from '@prisma/client'
import { ProjectRepository } from '../project-repository'
import { prisma } from '../../lib/prisma'
import { ProjectWithUserData } from './prisma-project-with-user-data-type'

export class PrismaProjectRepository implements ProjectRepository {
  async create(data: Prisma.ProjectUncheckedCreateInput): Promise<Project> {
    const project = await prisma.project.create({
      data,
    })

    return project
  }

  async fetchProjectsByUserId(userId: string): Promise<Project[]> {
    const projects = await prisma.project.findMany({
      where: {
        user_id: userId,
      },
    })

    return projects
  }

  async addPhotoUrl(projectId: string, photoUrl: string): Promise<Project> {
    const project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        photo_url: photoUrl,
      },
    })

    return project
  }

  async fetchProjectByTags(tags: string[]): Promise<ProjectWithUserData[]> {
    const project = await prisma.project.findMany({
      where: {
        tags: { hasEvery: tags },
      },
      include: {
        user: {
          select: {
            avatar_url: true,
            name: true,
            surname: true,
          },
        },
      },
    })

    return project
  }

  async fetchProjectById(
    projectId: string,
  ): Promise<ProjectWithUserData | null> {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        user: {
          select: {
            avatar_url: true,
            name: true,
            surname: true,
          },
        },
      },
    })

    return project
  }

  async deleteProjectByID(projectId: string): Promise<void> {
    await prisma.project.delete({
      where: {
        id: projectId,
      },
    })
  }

  async edit(data: Prisma.ProjectUncheckedCreateInput): Promise<Project> {
    const project = await prisma.project.update({
      where: { id: data.id },
      data,
    })

    return project
  }
}
