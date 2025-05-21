import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'
import { db } from '../../src/infra/db'
import { schema } from '../../src/infra/db/schemas'

export async function makeLink(
  overrides?: Partial<InferInsertModel<typeof schema.links>>
) {
  const originalUrl = faker.internet.url()
  const shortenedUrl = faker.internet.url()

  const [link] = await db
    .insert(schema.links)
    .values({ originalUrl, shortenedUrl, ...overrides })
    .returning()

  return link
}
