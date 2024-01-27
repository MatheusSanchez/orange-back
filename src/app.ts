import fastify from 'fastify'
import { userRoutes } from './controller/user/routes'
import { env } from './env'
import { ZodError } from 'zod'
import { authRoutes } from './controller/session/routes'
import fastifyJwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { logMiddleware } from './controller/middlewares/logMiddleware'

export const app = fastify()

app.register(cors, {
  origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
})
app.register(userRoutes)
app.addHook('preHandler', logMiddleware)

app.register(authRoutes)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})


app.setErrorHandler((error, _, response) => {
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: log this error somewhere
    console.error(error) // to test deploy
  }
  if (error instanceof ZodError) {
    return response
      .status(400)
      .send({ message: 'Validation Error', issues: error.format() })
  }

  return response.status(500).send({ message: 'Internal Server Error' })
})
