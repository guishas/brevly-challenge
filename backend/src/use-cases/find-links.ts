import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeRight } from '@/shared/either'

interface FindLinksOutput {
  links: {
    id: string
    originalUrl: string
    shortenedUrl: string
    visits: number
    createdAt: Date
  }[]
}

export async function findLinks(): Promise<Either<never, FindLinksOutput>> {
  const links = await db.select().from(schema.links)

  return makeRight({ links })
}
