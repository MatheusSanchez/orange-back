import { Prisma, Project } from '@prisma/client'

export interface ProjectRepository {
  create(data: Prisma.ProjectUncheckedCreateInput): Promise<Project>
  fetchProjectsByUserId(userId: string): Promise<Project[]>
  fetchProjectById(projectId: string): Promise<Project | null>
  addPhotoUrl(projectId: string, photoUrl: string): Promise<Project>
}
