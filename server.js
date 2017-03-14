const express = require('express')
const app = express()

app.set('port', process.env.PORT || 3000)
app.locals.title = "Secret Box"
app.locals.secrets = [{
  id: 'dirty_secret',
  message: 'dirty secret goes here'
}]

app.get('/', (req, res) => {
  res.send('It\'s a secret to everyone.')
})

app.get('/api/v1/secrets/:id', (req, res) => {
  const { id } = req.params
  const secret = app.locals.secrets.find(secret => {
    return secret.id === id
  })

  if(!secret) {
    return res.sendStatus(404)
  }

  res.json(secret)
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})
