import { env } from '@/env'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { eq } from 'drizzle-orm'
import { LinkNotFoundError } from './errors/link-not-found-error'

interface GetOriginalUrlInput {
  shortenedUrl: string
}

interface GetOriginalUrlOutput {
  originalUrl: string
}

export async function getOriginalUrl({
  shortenedUrl,
}: GetOriginalUrlInput): Promise<
  Either<LinkNotFoundError, GetOriginalUrlOutput>
> {
  const [link] = await db
    .select()
    .from(schema.links)
    .where(eq(schema.links.shortenedUrl, `${env.FRONTEND_URL}/${shortenedUrl}`))

  if (!link) {
    return makeLeft(new LinkNotFoundError())
  }

  await db
    .update(schema.links)
    .set({ visits: link.visits + 1 })
    .where(eq(schema.links.id, link.id))

  return makeRight({ originalUrl: link.originalUrl })
}
