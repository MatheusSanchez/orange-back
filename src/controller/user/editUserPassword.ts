import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { EditUserPasswordUseCase } from '../../use-cases/user/editUserPasswordUseCase'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'
import { InvalidCredentialsError } from '../../use-cases/errors/InvalidCredentialsError'

export async function editUserPassword(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const registerBodySchema = z.object({
    oldPassword: z.string(),
    newPassword: z.string().min(6),
  })

  const { oldPassword, newPassword } = registerBodySchema.parse(request.body)

  const usersRepository = new PrismaUsersRepository()
  const editUserPasswordUseCase = new EditUserPasswordUseCase(usersRepository)
  try {
    const { user } = await editUserPasswordUseCase.execute({
      oldPassword,
      newPassword,
      userId: request.user.sub,
    })
    return response
      .status(200)
      .send({ user: { ...user, password_hash: undefined } })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return response.status(404).send({ error: 'User was not Found !' })
    } else if (error instanceof InvalidCredentialsError) {
      return response.status(401).send({ error: 'Invalid old Password!' })
    }

    throw error
  }
}
