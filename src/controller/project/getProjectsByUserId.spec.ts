import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { ProjectRepository } from '../../repositories/project-repository'
import { PrismaProjectRepository } from '../../repositories/prisma/prisma-project-repository'
import { createAndAuthenticateUser } from '../../utils/tests/create-and-authenticate-user'

let projectRepository: ProjectRepository

let userAuth: {
  token: string
  userId: string
}

describe('Get Projets By UserId E2E', () => {
  beforeAll(async () => {
    projectRepository = new PrismaProjectRepository()

    await app.ready()
    userAuth = await createAndAuthenticateUser(app)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get all projects from an user', async () => {
    const description = 'ReactProject'
    const link = 'www.google.com.br'
    const tags = ['react', 'node']
    const title = 'ReactProject'

    await projectRepository.create({
      // First Project
      description,
      link,
      tags,
      title,
      user_id: userAuth.userId,
    })

    await projectRepository.create({
      // Second Project
      description,
      link,
      tags,
      title,
      user_id: userAuth.userId,
    })

    const getProjectsByUserIdResponse = await request(app.server)
      .get(`/projects`)
      .set('Authorization', `Bearer ${userAuth.token}`)

    expect(getProjectsByUserIdResponse.statusCode).toEqual(200)
    expect(getProjectsByUserIdResponse.body.projects).toHaveLength(2)
    expect(getProjectsByUserIdResponse.body.projects[0]).toEqual(
      expect.objectContaining({ title }),
    )

    expect(getProjectsByUserIdResponse.body.projects[1]).toEqual(
      expect.objectContaining({ tags }),
    )
  })

  it('should not be able to get projects without authenticate', async () => {
    const getProjectsByUserIdResponse = await request(app.server).get(
      `/projects`,
    )

    expect(getProjectsByUserIdResponse.statusCode).toEqual(401)

    expect(getProjectsByUserIdResponse.body).toEqual(
      expect.objectContaining({
        message: 'Unauthorized',
      }),
    )
  })
})
