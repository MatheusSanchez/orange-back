import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src', '!src/**/*.spec.*', '!src/utils/tests/**'],
})
