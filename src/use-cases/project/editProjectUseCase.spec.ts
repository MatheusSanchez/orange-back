import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryProjectRepository } from '../../repositories/in-memory-db/inMemoryProjectRepository'
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError'
import { EditProjectUseCase } from './editProjectUseCase'
import { User } from '@prisma/client'

let projectRepository: InMemoryProjectRepository
let editProjectUseCase: EditProjectUseCase
let newUser: User

describe('Edit Project By Id Use Case', () => {
  beforeEach(async () => {
    projectRepository = new InMemoryProjectRepository()
    editProjectUseCase = new EditProjectUseCase(projectRepository)
    newUser = await projectRepository.dbUser.create({
      name: 'John',
      surname: 'Doe',
      email: 'johndoe@email.com',
      password_hash: '123456',
    })
  })

  it('should be able edit one project by ID', async () => {
    const projectWithoutEditing = await projectRepository.create({
      title: 'React Typescript 1',
      description: 'Best Project',
      tags: ['react', 'node'],
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      user_id: newUser.id,
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
