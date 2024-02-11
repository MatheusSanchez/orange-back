import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '../../use-cases/errors/ResourceNotFoundError'
import { AwsS3Error } from '../../use-cases/errors/AwsS3Error'
import { PrismaUsersRepository } from '../../repositories/prisma/prisma-users-repository'
import { AddImageToUserUseCase } from '../../use-cases/user/addImageToUserUseCase'

export async function addImageUser(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const userRepository = new PrismaUsersRepository()
  const addImageToUserUseCase = new AddImageToUserUseCase(userRepository)

  const photo = await request.file()

  if (photo === undefined) {
    return response.status(400).send({ error: 'Fail load a photo!' })
  }

  try {
    const { user } = await addImageToUserUseCase.execute({
      userId: request.user.sub,
      photo,
    })
    return response
      .status(200)
      .send({ user: { ...user, password_hash: undefined } })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return response.status(400).send({ error: 'User was not found !' })
    } else if (error instanceof AwsS3Error) {
      return response.status(400).send({ error: error.message })
    }
    throw error
  }
}
