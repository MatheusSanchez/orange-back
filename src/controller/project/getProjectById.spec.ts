import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { ProjectRepository } from '../../repositories/project-repository'
import { PrismaProjectRepository } from '../../repositories/prisma/prisma-project-repository'

import { randomUUID } from 'crypto'
import { createAndAuthenticateUser } from '../../utils/tests/create-and-authenticate-user'

let projectRepository: ProjectRepository

let userAuth: {
  token: string
  userId: string
}

describe('Get Projets By ID E2E', () => {
  beforeAll(async () => {
    projectRepository = new PrismaProjectRepository()
    await app.ready()
    userAuth = await createAndAuthenticateUser(app)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a project by ID', async () => {
    const description = 'ReactProject'
    const link = 'www.google.com.br'
    const tags = ['react', 'node']
    const title = 'ReactProject'

    const project = await projectRepository.create({
      description,
      link,
      tags,
      title,
      user_id: userAuth.userId,
    })

    const getProjectByIdResponse = await request(app.server)
      .get(`/project/${project.id}`)
      .set('Authorization', `Bearer ${userAuth.token}`)

    expect(getProjectByIdResponse.statusCode).toEqual(200)
    expect(getProjectByIdResponse.body.project).toEqual(
      expect.objectContaining({
        title,
        user: { name: 'John', surname: 'Doe', avatar_url: expect.any(String) },
        tags,
      }),
    )
  })

  it('should not be able to get a project that does not exist', async () => {
    const getProjectByIdResponse = await request(app.server)
      .get(`/project/${randomUUID()}`)
      .set('Authorization', `Bearer ${userAuth.token}`)

    expect(getProjectByIdResponse.statusCode).toEqual(404)

    expect(getProjectByIdResponse.body).toEqual(
      expect.objectContaining({
        error: 'Project was not Found !',
      }),
    )
  })
})
