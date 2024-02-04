import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src',
    '!src/**/*.spec.*',
    '!src/utils/create-and-authenticate-user.ts',
  ],
})
