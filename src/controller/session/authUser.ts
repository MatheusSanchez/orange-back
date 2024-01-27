import { FastifyReply, FastifyRequest } from 'fastify'
import { InMemoryUserRepository } from '../../repositories/in-memory-db/inMemoryUserRepository'
import { AuthUserUseCase } from '../../use-cases/authUserUseCase'
import { z } from 'zod'

export async function authUser( 
  request: FastifyRequest,
  response: FastifyReply,
) {

  const userRepository = new InMemoryUserRepository()
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