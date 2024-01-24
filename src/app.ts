import fastify from 'fastify'
import { userRoutes } from './controller/user/routes'


export const app = fastify()
app.register(userRoutes)
