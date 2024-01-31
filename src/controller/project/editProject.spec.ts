import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { randomUUID } from 'crypto'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { UserRepository } from '../../repositories/user-repository'

let userRepository: UserRepository

describe('edit Project E2E', () => {
  beforeAll(async () => {
    userRepository = new PrismaUsersRepository()
    await app.ready()
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

    const newUser = await userRepository.create({
      email: 'john_doe@email.com',
      name: 'John',
      surname: 'Doe',
      password_hash: 'password',
    })

    const createProjectResponse = await request(app.server)
      .post(`/user/${newUser.id}/project`)
      .send(createProjectBody)

    const editProjectResponse = await request(app.server)
      .put(`/project/${createProjectResponse.body.project.id}/edit`)
      .send({
        title: 'EditedTitle',
        tags: ['react', 'node', 'edit'],
        link: 'https://editedlin.com',
        description: 'EditedDescription',
      })

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

    expect(editProjectResponse.statusCode).toEqual(404)

    expect(editProjectResponse.body).toEqual(
      expect.objectContaining({
        error: 'Project was not Found !',
      }),
    )
  })
})
