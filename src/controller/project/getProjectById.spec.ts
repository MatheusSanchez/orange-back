import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { ProjectRepository } from '../../repositories/project-repository'
import { PrismaProjectRepository } from '../../repositories/prisma/prisma-project-repository'

import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { UserRepository } from '../../repositories/user-repository'
import { randomUUID } from 'crypto'

let projectRepository: ProjectRepository
let userRepository: UserRepository

describe('Get Projets By ID E2E', () => {
  beforeAll(async () => {
    projectRepository = new PrismaProjectRepository()
    userRepository = new PrismaUsersRepository()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a project by ID', async () => {
    const description = 'ReactProject'
    const link = 'www.google.com.br'
    const tags = 'React'
    const title = 'ReactProject'

    const newUser = await userRepository.create({
      email: 'john_doe@email.com',
      name: 'John',
      surname: 'Doe',
      password_hash: 'password',
    })

    const project = await projectRepository.create({
      description,
      link,
      tags,
      title,
      user_id: newUser.id,
    })

    const getProjectByIdResponse = await request(app.server).get(
      `/project/${project.id}`,
    )

    expect(getProjectByIdResponse.statusCode).toEqual(200)
    expect(getProjectByIdResponse.body.project).toEqual(
      expect.objectContaining({ title }),
    )

    expect(getProjectByIdResponse.body.project).toEqual(
      expect.objectContaining({ tags }),
    )
  })

  it('should not be able to get a project that does not exist', async () => {
    const getProjectByIdResponse = await request(app.server).get(
      `/project/${randomUUID()}`,
    )

    expect(getProjectByIdResponse.statusCode).toEqual(404)

    expect(getProjectByIdResponse.body).toEqual(
      expect.objectContaining({
        error: 'Project was not Found !',
      }),
    )
  })
})
