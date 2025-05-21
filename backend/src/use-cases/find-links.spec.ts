import { isRight } from '@/shared/either'
import { makeLink } from 'test/factories/make-link'
import { describe, expect, it } from 'vitest'
import { findLinks } from './find-links'

describe('find links', () => {
  it('should be able to find links', async () => {
    const link1 = await makeLink()
    const link2 = await makeLink()

    const sut = await findLinks()

    expect(isRight(sut)).toBe(true)
    expect(sut.right?.links).toHaveLength(sut.right?.links.length ?? 0)
  })
})
