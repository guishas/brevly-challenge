import { isRight } from '@/shared/either'
import { describe, expect, it } from 'vitest'
import { exportLinks } from './export-links'

describe('export links', () => {
  it('should be able to export links', async () => {
    const sut = await exportLinks()

    expect(isRight(sut)).toBe(true)
    expect(sut.right).toMatchObject(
      expect.objectContaining({
        reportUrl: expect.any(String),
      })
    )
  })
})
