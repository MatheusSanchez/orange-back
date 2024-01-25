import fastify from 'fastify'
import { userRoutes } from './controller/user/routes'
import { env } from './env'
import { ZodError } from 'zod'


export const app = fastify()
app.register(userRoutes)


app.setErrorHandler((error, _, response) => {
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: log this error somewhere
  }
  if (error instanceof ZodError) {
    return response
      .status(400)
      .send({ message: 'Validation Error', issues: error.format() })
  }

  return response.status(500).send({ message: 'Internal Server Error' })
})