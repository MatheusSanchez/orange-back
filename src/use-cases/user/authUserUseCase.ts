import { User } from '@prisma/client'
import { UserRepository } from '../../repositories/user-repository'
import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from '../errors/InvalidCredentialsError'

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
      throw new InvalidCredentialsError('Email e/ou senha inválido.')
    }

    const passwordMatched = await compare(password, user.password_hash)

    if (!passwordMatched) {
      throw new InvalidCredentialsError('Email e/ou senha inválido.')
    }

    return { user }
  }
}
