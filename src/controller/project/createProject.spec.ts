import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { createAndAuthenticateUser } from '../../utils/tests/create-and-authenticate-user'

let userAuth: {
  token: string
  userId: string
}

describe('createProject E2E', () => {
  beforeAll(async () => {
    await app.ready()
    userAuth = await createAndAuthenticateUser(app)
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

    const createProjectResponse = await request(app.server)
      .post(`/user/project`)
      .send(createProjectBody)
      .set('Authorization', `Bearer ${userAuth.token}`)

    expect(createProjectResponse.statusCode).toEqual(201)
    expect(createProjectResponse.body.project.title).toEqual('Squad40 Project')
    expect(createProjectResponse.body.project.tags).toEqual(['react', 'node'])
  })

  it('should not be able to create a project without authenticate', async () => {
    const createProjectBody = {
      title: 'Squad40 Project',
      tags: ['react', 'node'],
      link: 'https://Squad40.com',
      description: 'Squad40 description',
    }

    const response = await request(app.server)
      .post(`/user/project`)
      .send(createProjectBody)

    expect(response.status).toEqual(401)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Unauthorized',
      }),
    )
  })
})
