const express = require('express')
const graphqlHTTP = require('express-graphql')
const jwt = require('express-jwt')
const path = require('path')
const html = require('@conveyal/woonerf/build/lib/html')

const {schema, rootValue} = require('./graphql')
const db = require('./db')

const PORT = process.env.PORT || 9966
const SECRET = process.env.AUTH0_SECRET

const app = express()

if (SECRET) {
  app.use(jwt({secret: SECRET}))
}

app.use('/assets', express.static(path.resolve(__dirname, '../assets')))
app.use('/graphql', graphqlHTTP({schema, rootValue, graphiql: true}))
app.get('*', (req, res) =>
  res.status(200).type('html').send(html({title: 'Commute'})))

db.on('connected', () =>
  app.listen(PORT, (err) =>
    err ? console.error(err) : console.log('GraphQL API now running on port', PORT)))
