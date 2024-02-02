import { Prisma, Project } from '@prisma/client'
import { ProjectRepository } from '../project-repository'
import { prisma } from '../../lib/prisma'

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

  async fetchProjectById(projectId: string): Promise<Project | null> {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    })

    return project
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

  async fetchProjectByTags(tags: string[]): Promise<Project[]> {
    const project = await prisma.project.findMany({
      where: {
        tags: { hasEvery: tags },

      },
    })

    return project
  }

  async deleteProjectByID(projectId: string):Promise<void> {
    await prisma.project.delete({
      where: {
        id: projectId
      }
    })

    return
  }


  async edit(data: Prisma.ProjectUncheckedCreateInput): Promise<Project> {
    const project = await prisma.project.update({
      where: { id: data.id },
      data,
    })

    return project
  }
}
