import { Prisma, Project } from '@prisma/client'

export interface ProjectRepository {
  create(data: Prisma.ProjectUncheckedCreateInput): Promise<Project>
  fetchProjectsByUserId(userId: string): Promise<Project[]>
}
