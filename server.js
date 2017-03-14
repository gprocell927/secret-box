const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const md5 = require('md5')
const fs = require('fs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.set('port', process.env.PORT || 3000)
app.locals.title = "Secret Box"
app.locals.secrets = [{
  id: 'dirty_secret',
  message: 'dirty secret goes here'
}]

app.get('/', (req, res) => {
  res.send('It\'s a secret to everyone.')
})


app.post('/api/v1/secrets', (request, response) => {
  const { message } = request.body
  const id = md5(message)

  app.locals.secrets.push({ id, message })
  response.json({ id, message })
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

app.get('/api/v1/secrets', (request, response) => {
  response.json(app.locals.secrets)
})

app.put('/api/v1/secrets/:id', (request, response) => {
  const { message } = request.body
  const { id } = request.params
  let secret = app.locals.secrets.find(secret => {
    return secret.id == id
  })

  secret.message = message

  if(!secret) { return response.sendStatus(404) }
  response.json(secret)
})

app.delete('/api/v1/secrets/:id', (request, response) => {
  const { id } = request.params

  app.locals.secrets = app.locals.secrets.filter((secret) => {
    return secret.id !== id
  })

  if(!secret) { return response.sendStatus(404) }
  response.json(app.locals.secrets)
})

app.get('/', (request, response) => {
  fs.readFile(`${__dirname}/index.html`, (err, file) => {
    response.send(file)
  })
})
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})
