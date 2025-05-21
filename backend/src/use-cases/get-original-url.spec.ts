import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight } from '@/shared/either'
import { eq } from 'drizzle-orm'
import { makeLink } from 'test/factories/make-link'
import { describe, expect, it } from 'vitest'
import { LinkNotFoundError } from './errors/link-not-found-error'
import { getOriginalUrl } from './get-original-url'

describe('get original url', () => {
  it('should be able to get original url from shortened url', async () => {
    const link = await makeLink()

    const sut = await getOriginalUrl({ shortenedUrl: link.shortenedUrl })

    expect(isRight(sut)).toBe(true)
    expect(sut.right).toEqual({ originalUrl: link.originalUrl })
  })

  it('should not be able to get original url from shortened url that does not exist', async () => {
    const sut = await getOriginalUrl({ shortenedUrl: '1234' })

    expect(isLeft(sut)).toBe(true)
    expect(sut.left).toBeInstanceOf(LinkNotFoundError)
  })

  it('should be able to increment visits when getting original url', async () => {
    const link = await makeLink()

    await getOriginalUrl({ shortenedUrl: link.shortenedUrl })

    const sut = await getOriginalUrl({ shortenedUrl: link.shortenedUrl })

    expect(isRight(sut)).toBe(true)

    const [result] = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.id, link.id))

    expect(result.visits).toBe(2)
  })
})
