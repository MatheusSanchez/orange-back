import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { UserRepository } from '../user-repository';

export class PrismaUsersRepository implements UserRepository {
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }
  
  async findById(id: string): Promise<{ id: string; name: string; surname: string; email: string; password_hash: string; created_at: Date; updated_at: Date; } | null> {
    throw new Error('Method not implemented.');
  }
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })  

    return user
  }
}
