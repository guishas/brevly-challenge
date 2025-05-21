import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight, unwrapEither } from '@/shared/either'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { eq } from 'drizzle-orm'
import { makeLink } from 'test/factories/make-link'
import { describe, expect, it } from 'vitest'
import { createLink } from './create-link'
import { LinkAlreadyExistsError } from './errors/link-already-exists-error'

describe('create link', () => {
  it('should be able to create a link', async () => {
    const link = {
      originalUrl: faker.internet.url(),
      shortenedUrl: faker.internet.url(),
    }

    const sut = await createLink(link)

    expect(isRight(sut)).toBe(true)

    const result = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.shortenedUrl, link.shortenedUrl))

    expect(result).toHaveLength(1)
    expect(result[0].shortenedUrl).toEqual(link.shortenedUrl)
  })

  it('should not be able to create a link with the same shortened url', async () => {
    const link = {
      originalUrl: faker.internet.url(),
      shortenedUrl: faker.internet.url(),
    }

    await makeLink({
      shortenedUrl: link.shortenedUrl,
    })

    const sut = await createLink(link)

    expect(isLeft(sut)).toBe(true)
    expect(sut.left).toBeInstanceOf(LinkAlreadyExistsError)
  })
})
