import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { EditUserUseCase } from '../../use-cases/user/editUserUseCase'

export async function editUserById(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const editUserBodySchema = z.object({
    name: z.string(),
    surname: z.string(),
    country: z.string(),
  })

  const { name, surname, country } = editUserBodySchema.parse(request.body)

  const userRepository = new PrismaUsersRepository()
  const editUserUseCase = new EditUserUseCase(userRepository)

  try {
    const { user } = await editUserUseCase.execute({
      name,
      surname,
      country,
      userId: request.user.sub,
    })

    return response
      .status(200)
      .send({ user: { ...user, password_hash: undefined } })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return response.status(404).send({ error: 'User was not Found !' })
    }
  }
}
