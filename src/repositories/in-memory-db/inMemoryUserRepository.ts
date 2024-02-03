import { Prisma, User } from '@prisma/client'
import { UserRepository } from '../user-repository'
import { randomUUID } from 'crypto'

export class InMemoryUserRepository implements UserRepository {
  public db: User[] = []

  constructor() {}

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

  async create({
    id,
    name,
    surname,
    email,
    password_hash,
    country,
  }: Prisma.UserCreateInput) {
    const user: User = {
      id: id === undefined ? randomUUID() : id,
      name,
      surname,

      email,
      password_hash,

      created_at: new Date(),
      updated_at: new Date(),
      avatar_url: null,
      country: country || 'brasil',
    }

    this.db.push(user)
    return user
  }
}
