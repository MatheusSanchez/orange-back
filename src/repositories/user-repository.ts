import { Prisma, User } from '@prisma/client'

export interface editUserRequestPrisma {
  name: string
  surname: string
  country: string
  userId: string
}

export interface UserRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  edit({ name, surname, country, userId }: editUserRequestPrisma): Promise<User>
}
