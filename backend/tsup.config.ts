import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src', '!src/**/*.spec.ts', '!src/**/*.sql'],
})
