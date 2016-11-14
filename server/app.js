const express = require('express')
const graphqlHTTP = require('express-graphql')
const jwt = require('express-jwt')
const path = require('path')
const html = require('mastarm/react/html')

const {schema, rootValue} = require('./graphql')

const SECRET = process.env.AUTH0_SECRET

const app = express()

if (SECRET) {
  app.use(jwt({secret: SECRET}))
}

app.use('/assets', express.static(path.resolve(__dirname, '../assets')))
app.use('/graphql', graphqlHTTP({schema, rootValue, graphiql: true}))
app.get('*', (req, res) =>
  res.status(200).type('html').send(html({title: 'Commute'})))

export default app
