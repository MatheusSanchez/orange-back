import { FastifyReply, FastifyRequest } from 'fastify'
import { AuthUserUseCase } from '../../use-cases/authUserUseCase'
import { z } from 'zod'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'

export async function authUser( 
  request: FastifyRequest,
  response: FastifyReply,
) {

  const userRepository = new PrismaUsersRepository()
  const authUserUseCase = new AuthUserUseCase(userRepository)

  const AuthUserUseCaseSchema = z.object({
    email: z.string().email(),
    password: z.string()
  })

  const { email, password } = AuthUserUseCaseSchema.parse(request.body) 

  const { user } = await authUserUseCase.execute({ email, password })

  const token = await response.jwtSign(
    {},
    {
      sign: {
        sub: user.id
      },
    },
  )


  return response.status(200).send({ user, token })    
}