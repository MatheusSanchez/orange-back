import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../app'
import { UserRepository } from '../../repositories/user-repository'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { User } from '@prisma/client'
let userRepository: UserRepository
let newUser: User

describe('Get Projets By Tags E2E', () => {
  beforeAll(async () => {
    userRepository = new PrismaUsersRepository()

    newUser = await userRepository.create({
      email: 'john_doe@email.com',
      name: 'John',
      surname: 'Doe',
      password_hash: 'password',
    })

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get all projects that include some tag', async () => {
    const tags = ['tag0', 'tag1']

    const projectsToBeCreate = [
      {
        title: 'Project 01',
        description: 'Project 01',
        link: 'www.google.com.br',
        tags: ['tag0', 'tag1'],
      },
      {
        title: 'Project 02',
        description: 'Project 02',
        link: 'www.google.com.br',
        tags: ['tag0', 'tag1'],
      },

      {
        title: 'Project 03',
        description: 'Project 03',
        link: 'www.google.com.br',
        tags: ['tag7', 'tag8', 'tag9'],
      },
    ]

    for (const project of projectsToBeCreate) {
      await request(app.server)
        .post(`/user/${newUser.id}/project`)
        .send(project)
    }

    const getProjectsByTagsResponse = await request(app.server)
      .post(`/projects/tags`)
      .send({ tags })

    expect(getProjectsByTagsResponse.statusCode).toEqual(200)
    expect(getProjectsByTagsResponse.body.projects).toHaveLength(2)
    expect(getProjectsByTagsResponse.body.projects[0]).toEqual(
      expect.objectContaining({ title: 'Project 01' }),
    )
    expect(getProjectsByTagsResponse.body.projects[1]).toEqual(
      expect.objectContaining({ title: 'Project 02' }),
    )
  })

  it('should return 200 and empty object when not find projects by some tag', async () => {
    const tags = ['tagNotExist', 'tagNotExist']

    const getProjectsByTagsResponse = await request(app.server)
      .post(`/projects/tags`)
      .send({ tags })

    expect(getProjectsByTagsResponse.statusCode).toEqual(200)
    expect(getProjectsByTagsResponse.body.projects).toHaveLength(0)
  })

  it('should be able to get all projects NOT BEING case- sensitive', async () => {
    const tags = ['tAG7', 'TAG8', 'Tag9']

    // Projects with tags ['tag7', 'tag8', 'tag9'] are already registered
    // once the database is set up once per file.

    const getProjectsByTagsResponse = await request(app.server)
      .post(`/projects/tags`)
      .send({ tags })

    expect(getProjectsByTagsResponse.statusCode).toEqual(200)
    expect(getProjectsByTagsResponse.body.projects).toHaveLength(1)
    expect(getProjectsByTagsResponse.body.projects[0]).toEqual(
      expect.objectContaining({ title: 'Project 03' }),
    )
  })
})
