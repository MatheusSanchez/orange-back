import { User } from '@prisma/client'
import { UserRepository } from '../repositories/user-repository'
import { ResourceNotFoundError } from './errors/ResourceNotFoundError'
import { compare } from 'bcryptjs'

interface AuthUserUseCaseRequest {
  email: string
  password: string
}

interface AuthUserProfileUseCaseResponse {
  user: User
}

export class AuthUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: AuthUserUseCaseRequest): Promise<AuthUserProfileUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const passwordMatched = await compare(password, user.password_hash)

    // if (!passwordMatched) {
    //   throw new ResourceNotFoundError()
    // }

    if (password !== user.password_hash) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
