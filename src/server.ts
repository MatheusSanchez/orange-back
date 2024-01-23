import { app } from './app'
import { env } from './env'

app.get('/', (req, res) => {
  res.send('Lets go Força da Natureza !')
})

app.listen(env.PORT, () => {
  console.log('🔥🔥🔥 HTTP Server Running 🔥🔥🔥')
})
