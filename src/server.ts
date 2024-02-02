import { app } from './app'
import { env } from './env'

console.log(process.env)

app
  .listen({
    port: env.PORT,
    host: 'RENDER' in process.env ? '0.0.0.0' : 'localhost',
  })
  .then(() => {
    console.log('🔥🔥🔥 HTTP Server Running 🔥🔥🔥')
  })
