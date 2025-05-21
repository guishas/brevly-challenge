import { PassThrough, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { db, pg } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { uploadFileToStorage } from '@/infra/storage/upload-file-to-storage'
import { type Either, makeRight } from '@/shared/either'
import { stringify } from 'csv-stringify'

type ExportLinksOutput = {
  reportUrl: string
}

export async function exportLinks(): Promise<Either<never, ExportLinksOutput>> {
  const { sql, params } = db.select().from(schema.links).toSQL()

  const cursor = pg.unsafe(sql, params as string[]).cursor(1)

  const csv = stringify({
    delimiter: ',',
    header: true,
    columns: [
      { key: 'id', header: 'ID' },
      { key: 'original_url', header: 'URL Original' },
      { key: 'shortened_url', header: 'URL Encurtada' },
      { key: 'visits', header: 'Visitas' },
      { key: 'created_at', header: 'Criado em' },
    ],
  })

  const uploadToStorageStream = new PassThrough()

  const convertToCsvPipeline = pipeline(
    cursor,
    new Transform({
      objectMode: true,
      transform(chunks, encoding, callback) {
        for (const chunk of chunks) {
          this.push(chunk)
        }

        callback()
      },
    }),
    csv,
    uploadToStorageStream
  )

  const uploadToStorage = uploadFileToStorage({
    contentStream: uploadToStorageStream,
  })

  const [{ url }] = await Promise.all([uploadToStorage, convertToCsvPipeline])

  return makeRight({ reportUrl: url })
}
