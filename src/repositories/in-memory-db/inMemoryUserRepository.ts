import { Prisma, User } from '@prisma/client'
import { UserRepository } from '../user-repository'
import { randomUUID } from 'crypto'

export class InMemoryUserRepository implements UserRepository {
  private db: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    const User = this.db.find((User) => User.email === email)

    if (!User) {
      return null
    }

    return User
  }

  async findById(id: string): Promise<User | null> {
    const User = this.db.find((User) => User.id === id)

    if (!User) {
      return null
    }

    return User
  }

  // create in a in-memory database is just used to help us on unit tests;
  // that's why is not in our interface :)
  async create({
    name,
    surname,
    email,
    password_hash,
  }: Prisma.UserCreateInput) {
    const user: User = {
      id: randomUUID(),
      name,
      surname,

      email,
      password_hash,

      created_at: new Date(),
      updated_at: new Date(),
    }

    this.db.push(user)

    return user
  }

}
