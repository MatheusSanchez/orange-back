import { beforeEach, describe, expect, it  } from "vitest";
import { ProjectRepository } from "../repositories/project-repository";
import { GetProjectsByTagsUseCase } from "./getProjectsByTagsUseCase";
import { InMemoryProjectRepository } from "../repositories/in-memory-db/inMemoryProjectRepository";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";


let projectRepository: ProjectRepository
let getProjectByTagsUseCase: GetProjectsByTagsUseCase

describe('Get Projects By Tags Use Case', () => {
  beforeEach(() => {
    projectRepository = new InMemoryProjectRepository()
    getProjectByTagsUseCase = new GetProjectsByTagsUseCase(projectRepository)
  })

  it('should be able get project by Tags', async () => {
    await projectRepository.create({
      title: 'React Typescript 1',
      description: 'Best Project',
      tags: 'react',
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      user_id: 'user_id',
    })

    await projectRepository.create({
      title: 'React Typescript 2',
      description: 'Best Project 2',
      tags: 'react',
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      user_id: 'user_id',
    })

    await projectRepository.create({
      title: 'Node with Typescript',
      description: 'Best Node Project',
      tags: 'Node',
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      user_id: 'user_id',
    })

    const { projects } = await getProjectByTagsUseCase.execute({
      projectTags: 'React'
    })

    expect(projects).toHaveLength(2)

    expect(projects[0]).toEqual(
      expect.objectContaining({ tags: 'react' }),
    )

    expect(projects[1]).toEqual(
      expect.objectContaining({ tags: 'react' }),
    )
  })

  it('should not be able to get a project that dont have the searched tags' , async () => {
    await projectRepository.create({
      title: 'Node with Typescript',
      description: 'Best Node Project',
      tags: 'Node',
      link: 'https://github.com/luiseduardo3/nodets-petcanil',
      user_id: 'user_id',
    })

    const { projects } = await getProjectByTagsUseCase.execute({
      projectTags: 'React'
    })

    expect(projects).toEqual([])
  })
})