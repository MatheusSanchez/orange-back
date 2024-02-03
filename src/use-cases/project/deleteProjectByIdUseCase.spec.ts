import { describe, expect, it, beforeEach } from "vitest";
import { ProjectRepository } from "../../repositories/project-repository";
import { DeleteProjectByIdUseCase } from "./deleteProjectByIdUseCase";
import { InMemoryProjectRepository } from "../../repositories/in-memory-db/inMemoryProjectRepository";
import { GetProjectsByUserIdUseCase } from "./getProjectsByUserIdUseCase";
import { UserRepository } from "../../repositories/user-repository";
import { InMemoryUserRepository } from "../../repositories/in-memory-db/inMemoryUserRepository";

let userRepository: UserRepository
let projectRepository: ProjectRepository
let deleteProjectByIdUseCase: DeleteProjectByIdUseCase
let getProjectsByUserIdUseCase: GetProjectsByUserIdUseCase

describe('Delete Project By Id Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    projectRepository = new InMemoryProjectRepository()
    deleteProjectByIdUseCase = new DeleteProjectByIdUseCase(projectRepository)
    getProjectsByUserIdUseCase = new GetProjectsByUserIdUseCase(
      projectRepository,
      userRepository,
    )
  })

  it('should be able delete project by ID', async () => {
    const newUser = await userRepository.create({
      name: 'Matheus',
      surname: 'Sanchez',
      email: 'exemplo@gmail.com',
      password_hash: '123456',
    })

    const firstProject = await projectRepository.create({
      title: 'React Typescript 1',
      description: 'Best Project',
      tags: ['react', 'node'],
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      user_id: newUser.id,
    })

    const secondProject = await projectRepository.create({
      title: 'React Typescript 2',
      description: 'Best Project 2',
      tags: ['react', 'figma'],
      link: 'https://www.linkedin.com/in/pedrodecf/',
      user_id: newUser.id,
    })

    const deletedProject = await deleteProjectByIdUseCase.execute({ projectId: firstProject.id })
    const { projects } = await getProjectsByUserIdUseCase.execute({ userId: newUser.id })
    
    expect(deletedProject).toEqual(undefined)
    expect(projects).toHaveLength(1)
  })
})