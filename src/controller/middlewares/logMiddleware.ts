import { FastifyReply, FastifyRequest } from 'fastify'

export async function logMiddleware(request: FastifyRequest, _: FastifyReply) {
  console.log(`[${request.method}]  ${request.url}`)
}
