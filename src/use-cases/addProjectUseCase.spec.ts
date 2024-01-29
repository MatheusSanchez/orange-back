import { expect, describe, it, beforeEach } from 'vitest'

import { CreateProjectUseCase } from './addProjectUseCase'

import { InMemoryProjectRepository } from '../repositories/in-memory-db/inMemoryProjectRepository'
import { InMemoryUserRepository } from '../repositories/in-memory-db/inMemoryUserRepository'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError'

let projectRepository: InMemoryProjectRepository
let userRepository: InMemoryUserRepository
let createProjectUseCase: CreateProjectUseCase

describe('Create Project Use Case', () => {
  beforeEach(() => {
    projectRepository = new InMemoryProjectRepository()
    userRepository = new InMemoryUserRepository()
    createProjectUseCase = new CreateProjectUseCase(
      projectRepository,
      userRepository,
    )
  })

  it('should be able to create a new project', async () => {
    const newUser = await userRepository.create({
      name: 'Luis',
      surname: 'Pereira',
      email: 'exemplo@gmail.com',
      password_hash: '123456',
    })

    const { project } = await createProjectUseCase.execute({
      title: 'React Typescript',
      description: 'Melhor Projeto',
      tags: 'React, Node',
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      userId: newUser.id,
    })

    expect(project.id).toEqual(expect.any(String))
    expect(project.title).toEqual('React Typescript')
  })

  it('should not be able to create a project if the user was not found.', async () => {
    await expect(() =>
      createProjectUseCase.execute({
        title: 'Project with nonexistent user',
        description: 'Project without a valid user',
        tags: 'Invalid, Project',
        link: 'https://github.com/example/project-with-nonexistent-user',
        userId: 'non-existent-UserId',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
