import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { eq } from 'drizzle-orm'
import { LinkAlreadyExistsError } from './errors/link-already-exists-error'

interface CreateLinkInput {
  originalUrl: string
  shortenedUrl: string
}

type Link = typeof schema.links.$inferSelect

interface CreateLinkOutput {
  link: Link
}

export async function createLink({
  originalUrl,
  shortenedUrl,
}: CreateLinkInput): Promise<Either<LinkAlreadyExistsError, CreateLinkOutput>> {
  const [link] = await db
    .select()
    .from(schema.links)
    .where(eq(schema.links.shortenedUrl, shortenedUrl))

  if (link) {
    return makeLeft(new LinkAlreadyExistsError())
  }

  const [createdLink] = await db
    .insert(schema.links)
    .values({ originalUrl, shortenedUrl })
    .returning()

  return makeRight({ link: createdLink })
}
