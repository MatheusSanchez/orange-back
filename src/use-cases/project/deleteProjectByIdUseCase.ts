import { ProjectRepository } from "../../repositories/project-repository";

interface DeleteProjectByIdRequest {
  projectId: string
}

export class DeleteProjectByIdUseCase{
  constructor (
    private projectRepository: ProjectRepository,
  ) {}

    async execute({
       projectId,
    }: DeleteProjectByIdRequest): Promise<void>{
      await this.projectRepository.deleteProjectByID(projectId)
      return 
    }
}