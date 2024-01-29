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

describe('Get Projets By UserId E2E', () => {
  beforeAll(async () => {
    projectRepository = new PrismaProjectRepository()
    userRepository = new PrismaUsersRepository()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get all projects from an user', async () => {
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

    await projectRepository.create({
      // First Project
      description,
      link,
      tags,
      title,
      user_id: newUser.id,
    })

    await projectRepository.create({
      // Second Project
      description,
      link,
      tags,
      title,
      user_id: newUser.id,
    })

    const getProjectsByUserIdResponse = await request(app.server).get(
      `/project/${newUser.id}`,
    )

    expect(getProjectsByUserIdResponse.statusCode).toEqual(200)
    expect(getProjectsByUserIdResponse.body.projects).toHaveLength(2)
    expect(getProjectsByUserIdResponse.body.projects[0]).toEqual(
      expect.objectContaining({ title }),
    )

    expect(getProjectsByUserIdResponse.body.projects[1]).toEqual(
      expect.objectContaining({ tags }),
    )
  })

  it('should not be able to project that user does not exist', async () => {
    const getProjectsByUserIdResponse = await request(app.server).get(
      `/project/${randomUUID()}`,
    )

    expect(getProjectsByUserIdResponse.statusCode).toEqual(404)

    expect(getProjectsByUserIdResponse.body).toEqual(
      expect.objectContaining({
        error: 'User was not Found !',
      }),
    )
  })
})
