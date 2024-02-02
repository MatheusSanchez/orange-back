import { afterAll, beforeAll, describe, expect, it } from "vitest"
import request from 'supertest'
import { ProjectRepository } from '../../repositories/project-repository'
import { PrismaProjectRepository } from '../../repositories/prisma/prisma-project-repository'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { UserRepository } from '../../repositories/user-repository'
import { app } from "../../app"
import { randomUUID } from "crypto"

let projectRepository: ProjectRepository
let userRepository: UserRepository

describe('Delete Project By ID E2E', () => {
  beforeAll(async () => {
    projectRepository = new PrismaProjectRepository()
    userRepository = new PrismaUsersRepository()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to delete a project by ID', async () => {
    const description = 'ReactProject'
    const link = 'www.google.com.br'
    const tags = ['react', 'node']
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

    const deletedProjectByIdResponse = await request(app.server).delete(
      `/project/${project.id}`,
    )

    expect(deletedProjectByIdResponse.statusCode).toEqual(200)
    expect(deletedProjectByIdResponse.body).toEqual({})
  })

  it('should not be able to delete a project by ID that does not exist', async () => {

    const deletedProjectByIdResponse = await request(app.server).delete(
      `/project/${randomUUID()}`,
    )

    expect(deletedProjectByIdResponse.statusCode).toEqual(404)
    expect(deletedProjectByIdResponse.body).toEqual(
      expect.objectContaining({
        error: 'Unable to delete project !',
      }),
    )
  })

})