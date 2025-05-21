import { isLeft, unwrapEither } from '@/shared/either'
import { deleteLink } from '@/use-cases/delete-link'
import { LinkNotFoundError } from '@/use-cases/errors/link-not-found-error'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

const deleteLinkParamsSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
})

export async function deleteLinkRoute(app: FastifyInstance) {
  app.delete('/links/:id', async (request, reply) => {
    const { id } = deleteLinkParamsSchema.parse(request.params)

    const result = await deleteLink({ id })

    if (isLeft(result)) {
      const error = unwrapEither(result)
      if (error instanceof LinkNotFoundError) {
        return reply.status(404).send({
          message: error.message,
        })
      }
    }

    return reply.status(204).send()
  })
}
