import { app } from './app'
import { env } from './env'
import { sequelize } from './lib/sequelize'

app.get('/', async (req, res) => {
  sequelize
    .getQueryInterface()
    .showAllSchemas()
    .then((tableObj) => {
      console.log('Tables in database', '==========================')
      console.log(tableObj)
    })
    .catch((err) => {
      console.log('showAllSchemas ERROR', err)
    })

  res.send('Lets go Força da Natureza!')
})

app.listen(env.PORT, () => {
  console.log('🔥🔥🔥 HTTP Server Running 🔥🔥🔥')
})
