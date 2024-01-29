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
}
