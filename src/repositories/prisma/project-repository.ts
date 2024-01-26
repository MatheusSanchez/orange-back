import { Prisma, Project } from '@prisma/client'

export interface ProjectRepository {
  create(
    data: Prisma.ProjectCreateWithoutUserInput,
    userId: string,
  ): Promise<Project>
  findById(projectId: string): Promise<Project | null>
}
