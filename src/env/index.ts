import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  FRONTEND_URL: z.string(),
  STORAGE_TYPE: z.enum(['local', 's3']).default('local'),
  AWS_S3_URL: z.string().optional(),
  REGION: z.string().optional(),
  ACCESS_KEY_ID: z.string().optional(),
  BUCKET_NAME: z.string().optional(),
  SECRET_ACCESS_KEY: z.string().optional(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌❌❌ Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables.')
}

if (_env.data.STORAGE_TYPE === 's3') {
  if (
    _env.data.AWS_S3_URL === undefined ||
    _env.data.REGION === undefined ||
    _env.data.ACCESS_KEY_ID === undefined ||
    _env.data.BUCKET_NAME === undefined ||
    _env.data.SECRET_ACCESS_KEY === undefined
  ) {
    console.error('❌❌❌ Invalid environment variables')

    throw new Error('Invalid environment variables, missing aws settings')
  }
}

export const env = _env.data
