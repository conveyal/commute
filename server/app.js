const bodyParser = require('body-parser')
const express = require('express')
const jwt = require('express-jwt')
const path = require('path')
const html = require('mastarm/react/html')

import makeEndpoints from './routes'

const SECRET = process.env.AUTH0_SECRET

const app = express()

// middleware
if (SECRET) {
  app.use(jwt({secret: SECRET}))
}
app.use(bodyParser.json())

// static assets
app.use('/assets', express.static(path.resolve(__dirname, '../assets')))

// api
makeEndpoints(app)

// webapp
app.get('*', (req, res) =>
  res.status(200).type('html').send(html({title: 'Commute'})))

export default app
