import { FastifyReply, FastifyRequest } from 'fastify'
import { AuthUserUseCase } from '../../use-cases/user/authUserUseCase'
import { z } from 'zod'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { InvalidCredentialsError } from '../../use-cases/errors/InvalidCredentialsError'

export async function authUser(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const userRepository = new PrismaUsersRepository()
  const authUserUseCase = new AuthUserUseCase(userRepository)

  const AuthUserUseCaseSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })

  const { email, password } = AuthUserUseCaseSchema.parse(request.body)

  try {
    const { user } = await authUserUseCase.execute({ email, password })

    const token = await response.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    return response.status(200).send({ user, token })
  } catch (e) {
    if (e instanceof InvalidCredentialsError) {
      return response.status(401).send()
    }
  }
}
