import { env } from '@/env'
import fastifyCors from '@fastify/cors'
import { fastify } from 'fastify'
import { createLinkRoute } from './routes/create-link'
import { deleteLinkRoute } from './routes/delete-link'
import { exportLinksRoute } from './routes/export-links'
import { findLinksRoute } from './routes/find-links'
import { getOriginalUrlRoute } from './routes/get-original-url'

const app = fastify()

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

app.register(createLinkRoute)
app.register(getOriginalUrlRoute)
app.register(deleteLinkRoute)
app.register(findLinksRoute)
app.register(exportLinksRoute)

app.listen({ port: env.PORT, host: '0.0.0.0' }, () => {
  console.log('HTTP Server Running!')
})
