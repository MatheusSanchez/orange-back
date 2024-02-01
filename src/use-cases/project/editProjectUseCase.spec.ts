import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryProjectRepository } from '../../repositories/in-memory-db/inMemoryProjectRepository'
import { ProjectRepository } from '../../repositories/project-repository'
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError'
import { EditProjectUseCase } from './editProjectUseCase'

let projectRepository: ProjectRepository
let editProjectUseCase: EditProjectUseCase

describe('Edit Project By Id Use Case', () => {
  beforeEach(() => {
    projectRepository = new InMemoryProjectRepository()
    editProjectUseCase = new EditProjectUseCase(projectRepository)
  })

  it('should be able edit one project by ID', async () => {
    const projectWithoutEditing = await projectRepository.create({
      title: 'React Typescript 1',
      description: 'Best Project',
      tags: ['react', 'node'],
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      user_id: 'user_id',
    })

    const { project: projectEdited } = await editProjectUseCase.execute({
      title: 'New Title',
      description: projectWithoutEditing.description,
      tags: projectWithoutEditing.tags,
      link: projectWithoutEditing.link,
      projectId: projectWithoutEditing.id,
    })

    expect(projectEdited).toEqual(
      expect.objectContaining({
        title: 'New Title',
        description: projectWithoutEditing.description,
        tags: projectWithoutEditing.tags,
        link: projectWithoutEditing.link,
        id: projectWithoutEditing.id,
      }),
    )
  })

  it('should not be able to edit a project that does not exist', async () => {
    await expect(() =>
      editProjectUseCase.execute({
        title: 'title',
        description: 'description',
        tags: ['tags'],
        link: 'link',
        projectId: 'projectThatDoesNotExist',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
