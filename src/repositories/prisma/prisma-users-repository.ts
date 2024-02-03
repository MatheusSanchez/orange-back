import { Prisma, User } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import { UserRepository, editUserRequestPrisma } from '../user-repository'

export class PrismaUsersRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({
      data,
    })

    return user
  }

  async edit({
    name,
    surname,
    country,
    userId,
  }: editUserRequestPrisma): Promise<User> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, surname, country },
    })

    return user
  }
}
