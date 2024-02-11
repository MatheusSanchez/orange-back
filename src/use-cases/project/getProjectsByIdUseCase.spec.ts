import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryProjectRepository } from '../../repositories/in-memory-db/inMemoryProjectRepository'
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError'
import { GetProjectsByIdUseCase } from './getProjectsByIdUseCase'
import { defaultUserAvatarUrl } from '../../utils/tests/defaultUserAvatarUrl'

let projectRepository: InMemoryProjectRepository
let getProjectByIdUseCase: GetProjectsByIdUseCase

describe('Get Project By Id Use Case', () => {
  beforeEach(() => {
    projectRepository = new InMemoryProjectRepository()
    getProjectByIdUseCase = new GetProjectsByIdUseCase(projectRepository)
  })

  it('should be able get project by ID', async () => {
    const newUser = await projectRepository.dbUser.create({
      name: 'John',
      surname: 'Doe',
      email: 'johndoe@email.com',
      password_hash: '123456',
    })
    const newProject = await projectRepository.create({
      title: 'React Typescript 1',
      description: 'Best Project',
      tags: ['react', 'node'],
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      user_id: newUser.id,
    })

    const { project } = await getProjectByIdUseCase.execute({
      projectId: newProject.id,
    })

    expect(project).toEqual(
      expect.objectContaining({
        title: 'React Typescript 1',
        id: newProject.id,
        tags: ['react', 'node'],
        user: {
          name: 'John',
          surname: 'Doe',
          avatar_url: defaultUserAvatarUrl,
        },
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
