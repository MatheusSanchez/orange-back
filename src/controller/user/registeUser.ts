import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { RegisterUseCase } from "src/use-cases/register";
import { PrismaUsersRepository } from "src/repositories/prisma/prisma-users-repository";
import { UserAlreadyExistsError } from "src/use-cases/erros/user-already-exists-error";

export async function register(
  request: FastifyRequest,
  response: FastifyReply
) {
  const registerBodySchema = z.object({
    name: z.string(),
    surname: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });


  const { name, surname, email, password } = registerBodySchema.parse(
    request.body
  );

  const usersRepository = new PrismaUsersRepository(); 
  const registerUseCase = new RegisterUseCase(usersRepository);
  try {

    await registerUseCase.execute({
      name,
      surname,
      email,
      password,
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return response.status(409).send({ message: error.message });
    }

    throw error;
  }

  return response.status(201).send();
}
