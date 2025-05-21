import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/shared/either'
import { eq } from 'drizzle-orm'
import { LinkNotFoundError } from './errors/link-not-found-error'

interface DeleteLinkInput {
  id: string
}

export async function deleteLink({
  id,
}: DeleteLinkInput): Promise<Either<LinkNotFoundError, object>> {
  const [link] = await db
    .select()
    .from(schema.links)
    .where(eq(schema.links.id, id))

  if (!link) {
    return makeLeft(new LinkNotFoundError())
  }

  await db.delete(schema.links).where(eq(schema.links.id, link.id))

  return makeRight({})
}
