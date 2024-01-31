import { ProjectRepository } from "../../repositories/project-repository";
import { UserRepository } from "../../repositories/user-repository";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from 'supertest'

import { PrismaProjectRepository } from "../../repositories/prisma/prisma-project-repository";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { app } from "../../app";

let projectRepository: ProjectRepository
let userRepository: UserRepository

describe('Get Projects By Tags E2E', () => {
  beforeAll(async () => {
    projectRepository = new PrismaProjectRepository()
    userRepository = new PrismaUsersRepository()

    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a project by Tags', async () => {
    const newUser = await userRepository.create({
      email: 'john_doe@email.com',
      name: 'John',
      surname: 'Doe',
      password_hash: 'password',
    })

    await projectRepository.create({
      title: 'Projeto 1',
      tags: 'react',
      description: 'Descrição 1',
      link: 'https://github.com/pedrodecf',
      user_id: newUser.id,
    })

    await projectRepository.create({
      title: 'Projeto 2',
      tags: 'react',
      description: 'Descrição 2',
      link: 'https://www.linkedin.com/in/pedrodecf/',
      user_id: newUser.id,
    })

    await projectRepository.create({
      title: 'Projeto 3',
      tags: 'Node',
      description: 'Descrição 3',
      link: 'https://www.acabouminhasredesociais.com.br',
      user_id: newUser.id,
    })

    const getProjectByTagsResponse = await request(app.server).get(
        `/projects/tags/react`,
      )

    expect(getProjectByTagsResponse.statusCode).toEqual(200)

    expect(getProjectByTagsResponse.body.projects).toHaveLength(2);

    expect(getProjectByTagsResponse.body.projects[0]).toEqual(
      expect.objectContaining({ tags: 'react' }),
    )
  })
})
