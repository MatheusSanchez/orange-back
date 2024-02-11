import { hash } from 'bcryptjs'
import { UserRepository } from '../../repositories/user-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { User } from '@prisma/client'

interface CreateUserUseCaseRequest {
  name: string
  surname?: string
  email: string
  password: string
  avatar_url?: string
  is_google?: boolean
}

interface CreateUserUseCaseResponse {
  user: User
}

export class CreateUserUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({
    name,
    surname,
    email,
    password,
    avatar_url,
    is_google,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }
    const password_hash = await hash(password, 6)

    const user = await this.usersRepository.create({
      name,
      surname,
      email,
      password_hash,
      avatar_url,
      is_google,
    })

    return {
      user,
    }
  }
}
