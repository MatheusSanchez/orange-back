import { hash } from 'bcryptjs'
import { UserRepository } from '../repositories/user-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from '@prisma/client'

interface CreateUseCaseRequest {
  name: string
  surname: string
  email: string
  password: string
}

interface CreateUseCaseResponse {
  user: User
}

export class CreateUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({ 
    name, 
    surname, 
    email, 
    password, 
  }: CreateUseCaseRequest): Promise<CreateUseCaseResponse> {
    const password_hash = await hash(password, 6)
  
    const userWithSameEmail = await this.usersRepository.findByEmail(email)
  
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }
  
    const user = await this.usersRepository.create({
      name,
      surname,
      email,
      password_hash
    })
    
    return {
      user,
    }
   
  }
}

