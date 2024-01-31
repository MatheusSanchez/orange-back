import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { randomUUID } from 'crypto'
import { PrismaProjectRepository } from '../../repositories/prisma/prisma-project-repository'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { ProjectRepository } from '../../repositories/project-repository'
import { UserRepository } from '../../repositories/user-repository'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'

let projectRepository: ProjectRepository
let userRepository: UserRepository

describe('createProject E2E', () => {
  beforeAll(async () => {
    projectRepository = new PrismaProjectRepository()
    userRepository = new PrismaUsersRepository()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a project', async () => {
    const createProjectBody = {
      title: 'Squad40 Project',
      tags: 'Squad40',
      link: 'https://Squad40.com',
      description: 'Squad40 description',
    }

    const newUser = await userRepository.create({
      email: 'john_doe@email.com',
      name: 'John',
      surname: 'Doe',
      password_hash: 'password',
    })

    const createProjectResponse = await request(app.server)
      .post(`/user/${newUser.id}/project`)
      .send(createProjectBody)

    expect(createProjectResponse.statusCode).toEqual(201)
    expect(createProjectResponse.body.project).toBeDefined()
  })

  it('should handle ResourceNotFoundError', async () => {
    const createProjectBody = {
      title: 'Squad40 Project',
      tags: 'Squad40',
      link: 'https://Squad40.com',
      description: 'Squad40 description',
    }

    const userId = randomUUID()

    try {
      const response = await request(app.server)
        .post(`/user/${userId}/project`)
        .send(createProjectBody)

      if (response.status === 201) {
        throw new Error(
          'Expected the request to fail with ResourceNotFoundError',
        )
      }
    } catch (error) {
      if (!(error instanceof ResourceNotFoundError)) {
        throw error
      }

      expect(error.message).toContain('ResourceNotFoundError')
      expect(error.message).toContain('User was not Found !')
    }
  })
})
