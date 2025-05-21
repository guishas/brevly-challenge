import { unwrapEither } from '@/shared/either'
import { exportLinks } from '@/use-cases/export-links'
import type { FastifyInstance } from 'fastify'

export async function exportLinksRoute(app: FastifyInstance) {
  app.get('/links/export', async (request, reply) => {
    const result = await exportLinks()
    const output = unwrapEither(result)
    return reply.status(200).send(output)
  })
}
