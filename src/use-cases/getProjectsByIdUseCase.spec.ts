import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryProjectRepository } from '../repositories/in-memory-db/inMemoryProjectRepository'
import { ProjectRepository } from '../repositories/project-repository'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError'
import { GetProjectsByIdUseCase } from './getProjectsByIdUseCase'

let projectRepository: ProjectRepository
let getProjectByIdUseCase: GetProjectsByIdUseCase

describe('Get Project By Id Use Case', () => {
  beforeEach(() => {
    projectRepository = new InMemoryProjectRepository()
    getProjectByIdUseCase = new GetProjectsByIdUseCase(projectRepository)
  })

  it('should be able get project by ID', async () => {
    const newProject = await projectRepository.create({
      title: 'React Typescript 1',
      description: 'Best Project',
      tags: 'React',
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      user_id: 'user_id',
    })

    const { project } = await getProjectByIdUseCase.execute({
      projectId: newProject.id,
    })

    expect(project).toEqual(
      expect.objectContaining({
        title: 'React Typescript 1',
        id: newProject.id,
      }),
    )
  })

  it('should not be able to get a project that does not exist', async () => {
    await expect(() =>
      getProjectByIdUseCase.execute({
        projectId: 'projectDoesNotExist',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
