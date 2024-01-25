import { Prisma, User } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { UserRepository } from "../user-repository";

export class PrismaUsersRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async findById(id: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }
}
