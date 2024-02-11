import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryProjectRepository } from '../../repositories/in-memory-db/inMemoryProjectRepository'

import { GetProjectsByTagsUseCase } from './getProjetsByTagsUseCase'
import { User } from '@prisma/client'
import { defaultUserAvatarUrl } from '../../utils/tests/defaultUserAvatarUrl'

let projectRepository: InMemoryProjectRepository
let getProjectsByTagsUseCase: GetProjectsByTagsUseCase
let newUser: User

describe('Get Project By Tags', () => {
  beforeEach(async () => {
    projectRepository = new InMemoryProjectRepository()
    getProjectsByTagsUseCase = new GetProjectsByTagsUseCase(projectRepository)
    newUser = await projectRepository.dbUser.create({
      name: 'John',
      surname: 'Doe',
      email: 'johndoe@email.com',
      password_hash: '123456',
    })
  })

  it('should be able get projects that include a tag', async () => {
    await projectRepository.create({
      title: 'React Typescript 1',
      description: 'Best Project',
      tags: ['react', 'node'],
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      user_id: newUser.id,
    })

    await projectRepository.create({
      title: 'React Typescript 2',
      description: 'Best Project 2',
      tags: ['react', 'node', 'typescript'],
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      user_id: newUser.id,
    })

    const { projects } = await getProjectsByTagsUseCase.execute({
      projectTags: ['typescript'],
    })

    expect(projects).toHaveLength(1)
    expect(projects[0]).toEqual(
      expect.objectContaining({
        title: 'React Typescript 2',
        user: {
          name: newUser.name,
          surname: newUser.surname,
          avatar_url: defaultUserAvatarUrl,
        },
        tags: ['react', 'node', 'typescript'],
      }),
    )
  })

  it('Should be able to get projects that include some tags without duplicating the results.', async () => {
    await projectRepository.create({
      title: 'React Typescript 1',
      description: 'Best Project',
      tags: ['react', 'node'],
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      user_id: newUser.id,
    })

    await projectRepository.create({
      title: 'React Typescript 2',
      description: 'Best Project 2',
      tags: ['react', 'node', 'typescript'],
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      user_id: newUser.id,
    })

    await projectRepository.create({
      title: 'React Typescript 3',
      description: 'Best Project 2',
      tags: ['react', 'node'],
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      user_id: newUser.id,
    })

    const { projects } = await getProjectsByTagsUseCase.execute({
      projectTags: ['react', 'node'],
    })

    expect(projects).toHaveLength(3)
    expect(projects[0]).toEqual(
      expect.objectContaining({
        title: 'React Typescript 1',
        user: {
          name: newUser.name,
          surname: newUser.surname,
          avatar_url: defaultUserAvatarUrl,
        },
      }),
    )

    expect(projects[1]).toEqual(
      expect.objectContaining({
        title: 'React Typescript 2',
        user: {
          name: newUser.name,
          surname: newUser.surname,
          avatar_url: defaultUserAvatarUrl,
        },
      }),
    )

    expect(projects[2]).toEqual(
      expect.objectContaining({
        title: 'React Typescript 3',
        user: {
          name: newUser.name,
          surname: newUser.surname,
          avatar_url: defaultUserAvatarUrl,
        },
      }),
    )
  })

  it('Should be able to get projects that include tags NOT being case sensitive', async () => {
    await projectRepository.create({
      title: 'React Typescript 1',
      description: 'Best Project',
      tags: ['react', 'node'],
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      user_id: newUser.id,
    })

    await projectRepository.create({
      title: 'React Typescript 2',
      description: 'Best Project 2',
      tags: ['react', 'node', 'typescript'],
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      user_id: newUser.id,
    })

    await projectRepository.create({
      title: 'React Typescript 3',
      description: 'Best Project 2',
      tags: ['react', 'node'],
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      user_id: newUser.id,
    })

    const { projects } = await getProjectsByTagsUseCase.execute({
      projectTags: ['REACT', 'NODE'],
    })

    expect(projects).toHaveLength(3)
    expect(projects[0]).toEqual(
      expect.objectContaining({
        title: 'React Typescript 1',
        user: {
          name: newUser.name,
          surname: newUser.surname,
          avatar_url: defaultUserAvatarUrl,
        },
      }),
    )

    expect(projects[1]).toEqual(
      expect.objectContaining({
        title: 'React Typescript 2',
        user: {
          name: newUser.name,
          surname: newUser.surname,
          avatar_url: defaultUserAvatarUrl,
        },
      }),
    )

    expect(projects[2]).toEqual(
      expect.objectContaining({
        title: 'React Typescript 3',
        user: {
          name: newUser.name,
          surname: newUser.surname,
          avatar_url: defaultUserAvatarUrl,
        },
      }),
    )
  })

  it('should not be able to get a project if the tag was not registered', async () => {
    await projectRepository.create({
      title: 'React Typescript 1',
      description: 'Best Project',
      tags: ['tag'],
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      user_id: 'user_id',
    })

    await projectRepository.create({
      title: 'React Typescript 2',
      description: 'Best Project 2',
      tags: ['tag'],
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      user_id: 'user_id',
    })

    const { projects } = await getProjectsByTagsUseCase.execute({
      projectTags: ['react', 'node'],
    })

    expect(projects).toHaveLength(0)
  })
})
