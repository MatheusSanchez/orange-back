import { Prisma, User } from '@prisma/client'
import { UserRepository } from '../user-repository'
import { randomUUID } from 'crypto'

export class InMemoryUserRepository implements UserRepository {
  private db: User[] = []

   
  // This is a way to test our controllers without necessartralyy add the 
  // db repository; Once the program starts, one user is added to User[] and 
  // you can get http://localhost:3333/user/9600de4f-8d18-4e69-ba7a-ed7fa210618d
  // to check the routes;

  // this constructor will be delete later;
  constructor(){

    const email = 'johndoe2@email.com'
    const name = 'John'
    const surname = 'Doe'
    const password_hash = 'password_hash'
    const id = '9600de4f-8d18-4e69-ba7a-ed7fa210618d'

    this.create({
      id,
    name,
    surname,
    email,
    password_hash,
  })

  }

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
    id,
    name,
    surname,
    email,
    password_hash,
  }: Prisma.UserCreateInput) {
    const user: User = {
      id: (id == undefined) ? randomUUID() : id,
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
