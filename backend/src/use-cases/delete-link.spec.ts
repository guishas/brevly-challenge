import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { isLeft, isRight } from '@/shared/either'
import { eq } from 'drizzle-orm'
import { makeLink } from 'test/factories/make-link'
import { describe, expect, it } from 'vitest'
import { deleteLink } from './delete-link'
import { LinkNotFoundError } from './errors/link-not-found-error'

describe('delete link', () => {
  it('should be able to delete a link', async () => {
    const link = await makeLink()

    const sut = await deleteLink({ id: link.id })

    expect(isRight(sut)).toBe(true)

    const result = await db
      .select()
      .from(schema.links)
      .where(eq(schema.links.id, link.id))

    expect(result).toHaveLength(0)
  })

  it('should not be able to delete a link that does not exist', async () => {
    const sut = await deleteLink({ id: '1234' })

    expect(isLeft(sut)).toBe(true)
    expect(sut.left).toBeInstanceOf(LinkNotFoundError)
  })
})
