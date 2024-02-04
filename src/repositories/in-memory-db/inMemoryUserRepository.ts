import { Prisma, User } from '@prisma/client'
import { UserRepository, editUserRequestPrisma } from '../user-repository'
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
    avatar_url,
    is_google,
  }: Prisma.UserCreateInput) {
    const user: User = {
      id: id === undefined ? randomUUID() : id,
      name,
      surname,

      email,
      password_hash,

      created_at: new Date(),
      updated_at: new Date(),
      avatar_url:
        avatar_url ||
        'https://orangeapp-contents-prod.s3.amazonaws.com/avatar1.png',
      is_google: is_google || false,
      country: country || 'brasil',
    }

    this.db.push(user)
    return user
  }

  async edit({
    name,
    surname,
    country,
    userId,
  }: editUserRequestPrisma): Promise<User> {
    const indexToUpdate = this.db.findIndex((user) => user.id === userId)

    this.db[indexToUpdate] = {
      ...this.db[indexToUpdate],
      name,
      surname,
      country,
    }

    return this.db[indexToUpdate]
  }

  async addPhotoUrl(projectId: string, photoUrl: string): Promise<Project> {
    throw new Error('Method not implemented.')
  }
}
