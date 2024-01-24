import { User } from '@prisma/client'
import { UserRepository } from '../repositories/user-repository'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError'

interface GetUserByEmailUseCaseRequest {
  email: string
}

interface GetUserByEmailUseCaseResponse {
  user: User
}

export class GetUserByEmailUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
  }: GetUserByEmailUseCaseRequest): Promise<GetUserByEmailUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
