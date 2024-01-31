import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryProjectRepository } from '../../repositories/in-memory-db/inMemoryProjectRepository'
import { InMemoryUserRepository } from '../../repositories/in-memory-db/inMemoryUserRepository'
import { GetProjectsByUserIdUseCase } from './getProjectsByUserIdUseCase'
import { ProjectRepository } from '../../repositories/project-repository'
import { UserRepository } from '../../repositories/user-repository'
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError'

let projectRepository: ProjectRepository
let userRepository: UserRepository
let getProjectByUserIdUseCase: GetProjectsByUserIdUseCase

describe('Get Project By User Id Use Case', () => {
  beforeEach(() => {
    projectRepository = new InMemoryProjectRepository()

    userRepository = new InMemoryUserRepository()
    getProjectByUserIdUseCase = new GetProjectsByUserIdUseCase(
      projectRepository,
      userRepository,
    )
  })

  it('should be able get projects from an user', async () => {
    const newUser = await userRepository.create({
      name: 'Matheus',
      surname: 'Sanchez',
      email: 'exemplo@gmail.com',
      password_hash: '123456',
    })

    await projectRepository.create({
      title: 'React Typescript 1',
      description: 'Best Project',
      tags: ['react', 'node'],
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      user_id: newUser.id,
    })

    await projectRepository.create({
      title: 'React Typescript 2',
      description: 'Best Project 2',
      tags: ['react', 'node'],
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      user_id: newUser.id,
    })

    const { projects } = await getProjectByUserIdUseCase.execute({
      userId: newUser.id,
    })

    expect(projects).toHaveLength(2)
    expect(projects[0]).toEqual(
      expect.objectContaining({ title: 'React Typescript 1' }),
    )

    expect(projects[1]).toEqual(
      expect.objectContaining({ title: 'React Typescript 2' }),
    )
  })

  it('should not be able to create a project if the user was not found.', async () => {
    await expect(() =>
      getProjectByUserIdUseCase.execute({
        userId: 'userNotExist',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
