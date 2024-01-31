import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { randomUUID } from 'crypto'
import { PrismaProjectRepository } from '../../repositories/prisma/prisma-project-repository'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { ProjectRepository } from '../../repositories/project-repository'
import { UserRepository } from '../../repositories/user-repository'

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
      tags: ['react', 'node'],
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
    expect(createProjectResponse.body.project.title).toEqual('Squad40 Project')
    expect(createProjectResponse.body.project.tags).toEqual(['react', 'node'])
  })

  it('should not be able to create a project without user', async () => {
    const createProjectBody = {
      title: 'Squad40 Project',
      tags: ['react', 'node'],
      link: 'https://Squad40.com',
      description: 'Squad40 description',
    }

    const userId = randomUUID()

    const response = await request(app.server)
      .post(`/user/${userId}/project`)
      .send(createProjectBody)

    expect(response.body.message).toContain('User was not Found !')
    expect(response.status).toEqual(404)
  })
})
