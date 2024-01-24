import { User } from '@prisma/client'
import { UserRepository } from '../repositories/user-repository'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError'

interface GetUserByIdUseCaseRequest {
  id: string
}

interface GetUserProfileByIdUseCaseResponse {
  user: User
}

export class GetUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    id,
  }: GetUserByIdUseCaseRequest): Promise<GetUserProfileByIdUseCaseResponse> {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
