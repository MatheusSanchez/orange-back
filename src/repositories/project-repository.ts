import { Prisma, Project } from '@prisma/client'
import { ProjectWithUserData } from './prisma/prisma-project-with-user-data-type'

export interface ProjectRepository {
  create(data: Prisma.ProjectUncheckedCreateInput): Promise<Project>
  fetchProjectsByUserId(userId: string): Promise<Project[]>
  fetchProjectById(projectId: string): Promise<ProjectWithUserData | null>
  addPhotoUrl(projectId: string, photoUrl: string): Promise<Project>
  fetchProjectByTags(tags: string[]): Promise<ProjectWithUserData[]>
  edit(data: Prisma.ProjectUncheckedCreateInput): Promise<Project>
  deleteProjectByID(projectID: string): Promise<void>
}
