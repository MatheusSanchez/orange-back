import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { randomUUID } from 'crypto'
import { createAndAuthenticateUser } from '../../utils/tests/create-and-authenticate-user'

let userAuth: {
  token: string
  userId: string
}

describe('edit Project E2E', () => {
  beforeAll(async () => {
    await app.ready()
    userAuth = await createAndAuthenticateUser(app)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to edit  a project', async () => {
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

    const editProjectResponse = await request(app.server)
      .put(`/project/${createProjectResponse.body.project.id}/edit`)
      .send({
        title: 'EditedTitle',
        tags: ['react', 'node', 'edit'],
        link: 'https://editedlin.com',
        description: 'EditedDescription',
      })
      .set('Authorization', `Bearer ${userAuth.token}`)

    expect(createProjectResponse.statusCode).toEqual(201)

    expect(editProjectResponse.statusCode).toEqual(200)

    expect(editProjectResponse.body.project.title).toEqual('EditedTitle')
    expect(editProjectResponse.body.project.tags).toEqual([
      'react',
      'node',
      'edit',
    ])
    expect(editProjectResponse.body.project.description).toEqual(
      'EditedDescription',
    )
  })

  it('should not be able to edit a project that does not exist', async () => {
    const editProjectResponse = await request(app.server)
      .put(`/project/${randomUUID()}/edit`)
      .send({
        title: 'EditedTitle',
        tags: ['react', 'node', 'edit'],
        link: 'https://editedlin.com',
        description: 'EditedDescription',
      })
      .set('Authorization', `Bearer ${userAuth.token}`)

    expect(editProjectResponse.statusCode).toEqual(404)

    expect(editProjectResponse.body).toEqual(
      expect.objectContaining({
        error: 'Project was not Found !',
      }),
    )
  })
})
