import { Prisma, Project } from '@prisma/client'
import { ProjectRepository } from '../project-repository'
import { prisma } from '../../lib/prisma'

export class PrismaProjectRepository implements ProjectRepository {
  create(_: Prisma.ProjectUncheckedCreateInput): Promise<Project> {
    throw new Error('Method not implemented.')
  }

  async fetchProjectsByUserId(userId: string): Promise<Project[]> {
    const projects = await prisma.project.findMany({
      where: {
        user_id: userId,
      },
    })

    return projects
  }
}
