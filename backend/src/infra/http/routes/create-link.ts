import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { createLink } from '@/use-cases/create-link'
import { LinkAlreadyExistsError } from '@/use-cases/errors/link-already-exists-error'
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'

const createLinkBodySchema = z.object({
  originalUrl: z.string().url('Invalid URL format'),
  shortenedUrl: z
    .string()
    .min(1, 'Shortened URL is required')
    .regex(
      /^https?:\/\/[^\/]+\/[a-zA-Z0-9-]+$/,
      'Shortened URL must be a valid URL with only letters, numbers and hyphens after the last slash'
    ),
})

export async function createLinkRoute(app: FastifyInstance) {
  app.post('/links', async (request, reply) => {
    const body = createLinkBodySchema.parse(request.body)

    const result = await createLink(body)

    if (isLeft(result)) {
      const error = unwrapEither(result)
      if (error instanceof LinkAlreadyExistsError) {
        return reply.status(409).send({
          message: error.message,
        })
      }
    }

    if (isRight(result)) {
      const { id } = unwrapEither(result)
      return reply.status(201).send({ id })
    }
  })
}
