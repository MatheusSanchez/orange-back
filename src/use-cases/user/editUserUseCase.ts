import { User } from '@prisma/client'

import { ResourceNotFoundError } from '../errors/ResourceNotFoundError'
import { UserRepository } from '../../repositories/user-repository'

interface EditUserUseCaseRequest {
  name: string
  surname: string
  country: string
  userId: string
}

interface EditUserUseCaseResponse {
  user: User
}

export class EditUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    name,
    surname,
    country,
    userId,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const userToBeUpdated = await this.userRepository.findById(userId)

    if (!userToBeUpdated) {
      throw new ResourceNotFoundError()
    }

    const user = await this.userRepository.edit({
      name,
      surname,
      country,
      userId,
    })

    return {
      user,
    }
  }
}
