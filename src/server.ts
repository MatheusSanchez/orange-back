import { app } from './app'
import { env } from './env'
import { prisma } from './lib/prisma'

app.get('/', async (req, res) => {
  const user = await prisma.user.create({
    data: {
      name: 'Max',
      surname: 'Sousa',
      email: 'max@email.com',
      password_hash: '123',
    }
  })
  res.send('Lets go Força da Natureza!')
})

app.listen(env.PORT, () => {
  console.log('🔥🔥🔥 HTTP Server Running 🔥🔥🔥')
})