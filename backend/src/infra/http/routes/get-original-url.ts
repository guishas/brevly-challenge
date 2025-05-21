import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { LinkNotFoundError } from '@/use-cases/errors/link-not-found-error'
import { getOriginalUrl } from '@/use-cases/get-original-url'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

const getOriginalUrlParamsSchema = z.object({
  shortenedUrl: z.string().min(1, 'Shortened URL is required'),
})

export async function getOriginalUrlRoute(app: FastifyInstance) {
  app.get('/links/:shortenedUrl', async (request, reply) => {
    const { shortenedUrl } = getOriginalUrlParamsSchema.parse(request.params)

    const result = await getOriginalUrl({ shortenedUrl })

    if (isLeft(result)) {
      const error = unwrapEither(result)
      if (error instanceof LinkNotFoundError) {
        return reply.status(404).send({
          message: error.message,
        })
      }
    }

    if (isRight(result)) {
      const { originalUrl } = unwrapEither(result)
      return reply.redirect(originalUrl)
    }
  })
}
