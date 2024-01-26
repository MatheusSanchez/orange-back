import { expect, describe, it, beforeEach } from 'vitest'

import { CreateProjectUseCase } from './addProject'
import { InMemoryProjectRepository } from '../repositories/in-memory-db/inMemoryProjectRepository'
import { InMemoryUserRepository } from '../repositories/in-memory-db/inMemoryUserRepository'

let projectRepository: InMemoryProjectRepository
let userRepository: InMemoryUserRepository
let sut: CreateProjectUseCase

describe('Create Project Use Case', () => {
  beforeEach(() => {
    projectRepository = new InMemoryProjectRepository()
    userRepository = new InMemoryUserRepository()
    sut = new CreateProjectUseCase(projectRepository)
  })

  it('should be able to create Project', async () => {
    const user = await userRepository.findById(
      '9600de4f-8d18-4e69-ba7a-ed7fa210618d',
    )

    const { project } = await sut.execute({
      title: 'React Typescript',
      description: 'Melhor Projeto',
      tags: 'React, Node',
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      userId: user?.id || '1',
    })

    expect(project.id).toEqual(expect.any(String))
  })
})
