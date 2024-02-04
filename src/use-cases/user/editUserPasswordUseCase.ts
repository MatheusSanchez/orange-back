import { compare, hash } from 'bcryptjs'
import { UserRepository } from '../../repositories/user-repository'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/ResourceNotFoundError'
import { InvalidCredentialsError } from '../errors/InvalidCredentialsError'

interface EditUserPasswordUseCaseRequest {
  userId: string
  oldPassword: string
  newPassword: string
}

interface EditUserPasswordUseCaseResponse {
  user: User
}

export class EditUserPasswordUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
    newPassword,
    oldPassword,
  }: EditUserPasswordUseCaseRequest): Promise<EditUserPasswordUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const passwordMatched = await compare(oldPassword, user.password_hash)

    if (!passwordMatched) {
      throw new InvalidCredentialsError('Email e/ou senha inválido.')
    }

    const password_hash = await hash(newPassword, 6)

    const userUpdated = await this.userRepository.editPassword({
      userId,
      password_hash,
    })

    return {
      user: userUpdated,
    }
  }
}
