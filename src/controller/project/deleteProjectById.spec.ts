import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { ProjectRepository } from '../../repositories/project-repository'
import { PrismaProjectRepository } from '../../repositories/prisma/prisma-project-repository'
import { app } from '../../app'
import { randomUUID } from 'crypto'
import { createAndAuthenticateUser } from '../../utils/tests/create-and-authenticate-user'

let projectRepository: ProjectRepository

let userAuth: {
  token: string
  userId: string
}

describe('Delete Project By ID E2E', () => {
  beforeAll(async () => {
    projectRepository = new PrismaProjectRepository()

    await app.ready()
    userAuth = await createAndAuthenticateUser(app)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to delete a project by ID', async () => {
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

    const deletedProjectByIdResponse = await request(app.server)
      .delete(`/project/${project.id}`)
      .set('Authorization', `Bearer ${userAuth.token}`)

    expect(deletedProjectByIdResponse.statusCode).toEqual(200)
    expect(deletedProjectByIdResponse.body).toEqual({})
  })

  it('should not be able to delete a project by ID that does not exist', async () => {
    const deletedProjectByIdResponse = await request(app.server)
      .delete(`/project/${randomUUID()}`)
      .set('Authorization', `Bearer ${userAuth.token}`)

    expect(deletedProjectByIdResponse.statusCode).toEqual(404)
    expect(deletedProjectByIdResponse.body).toEqual(
      expect.objectContaining({
        error: 'Unable to delete project !',
      }),
    )
  })
})
