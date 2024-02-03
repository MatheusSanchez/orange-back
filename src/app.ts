import { userRoutes } from './controller/user/routes'
import { env } from './env'
import { ZodError } from 'zod'
import { authRoutes } from './controller/session/routes'
import fastifyJwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { logMiddleware } from './controller/middlewares/logMiddleware'

import { projectRoutes } from './controller/project/routes'
import fastify from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

export const app = fastify()

app.register(fastifySwagger)

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'Orange Portfolio API',
      description: 'Testing the Fastify swagger API',
      version: '0.1.0',
    },
  },
  exposeRoute: true,
})

app.register(cors, {
  origin: [env.FRONTEND_URL],
})

app.addHook('preHandler', logMiddleware)

app.register(userRoutes)
app.register(projectRoutes)

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
