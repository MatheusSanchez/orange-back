import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

export const setupSwagger = (app) => {
  app.register(fastifySwagger, {
    exposeRoute: true,
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'Test swagger - Orange Portfolio',
        description: 'Testing the Fastify swagger API',
        version: '1.0.0',
      },
    },
  })

  app.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    swagger: {
      info: {
        title: 'Test swagger - Orange Portfolio',
        description: 'Testing the Fastify swagger API',
        version: '1.0.0',
      },
    },
    exposeRoute: true,
  })
}