const bodyParser = require('body-parser')
const express = require('express')
const jwt = require('express-jwt')
const morgan = require('morgan')
const path = require('path')
const html = require('@conveyal/woonerf/html')

const env = require('./utils/env').env
const routes = require('./routes')

const app = express()

// middleware
let jwtMiddleWare
if (env.AUTH0_SIGNING_CERTIFICATE && process.env.NODE_ENV !== 'test') {
  jwtMiddleWare = jwt({
    algorithms: ['HS256', 'RS256'],
    secret: env.AUTH0_SIGNING_CERTIFICATE
  })
} else {
  jwtMiddleWare = (req, res, next) => {
    req.user = {
      sub: 'test-user'
    }
    next()
  }
}
app.use(morgan('combined'))
app.use(bodyParser.json({ limit: '50mb' }))

// static assets
app.use('/assets', express.static(path.resolve(__dirname, '../assets')))

// api
routes(app, jwtMiddleWare)

const htmlString = html({
  staticHost: process.env.STATIC_HOST || '/',
  title: 'Commute'
})

// webapp
app.get('*', (req, res) => {
  res.status(200).type('html').send(htmlString)
})

module.exports = app
