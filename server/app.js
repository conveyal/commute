const bodyParser = require('body-parser')
const express = require('express')
const jwt = require('express-jwt')
const path = require('path')
const html = require('@conveyal/woonerf/html')

const env = require('./utils/env').env
const routes = require('./routes')

const app = express()

// middleware
let jwtMiddleWare
if (env.AUTH0_SECRET && process.env.NODE_ENV !== 'test') {
  jwtMiddleWare = jwt({secret: env.AUTH0_SECRET})
} else {
  jwtMiddleWare = (req, res, next) => {
    req.user = {
      sub: 'test-user'
    }
    next()
  }
}
app.use(bodyParser.json({ limit: '50mb' }))

// static assets
app.use('/assets', express.static(path.resolve(__dirname, '../assets')))

// api
routes(app, jwtMiddleWare)

let htmlString
const title = 'Commute'
if (process.env.STATIC_HOST) {
  // In heroku environment, get js and css from s3
  const host = process.env.STATIC_HOST
  htmlString = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
      <link href="${host}assets/index.css" rel="stylesheet">

      <title>${title}</title>
    </head>
    <body>
      <div id="root"></div>
      <script src="${host}assets/index.js"></script>
    </body>
  </html>
  `
} else {
  htmlString = html({title})
}

// webapp
app.get('*', (req, res) => {
  if (['/', '/login'].indexOf(req.originalUrl) === -1) {
    return res.redirect('/')
  }
  res.status(200).type('html').send(htmlString)
})

module.exports = app
