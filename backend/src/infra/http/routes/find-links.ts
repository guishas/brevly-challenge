import { unwrapEither } from '@/shared/either'
import { findLinks } from '@/use-cases/find-links'
import type { FastifyInstance } from 'fastify'

export async function findLinksRoute(app: FastifyInstance) {
  app.get('/links', async (request, reply) => {
    const result = await findLinks()
    const output = unwrapEither(result)
    return reply.status(200).send(output)
  })
}
