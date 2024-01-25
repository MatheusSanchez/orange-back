import { hash } from 'bcryptjs'
import { UserRepository } from '../repositories/user-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface CreateUseCaseRequest {
  name: string
  surname: string
  email: string
  password: string
}

export class CreateUseCase {
  constructor(private usersRepository: UserRepository) {}

  async handle({ name, surname, email, password }: CreateUseCaseRequest) {
    const password_hash = await hash(password, 6)
  
    const userWithSameEmail = await this.usersRepository.findByEmail(email)
  
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }
  
    await this.usersRepository.create({
      name,
      surname,
      email,
      password_hash
    })
  }
}

