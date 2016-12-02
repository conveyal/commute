const app = require('./app')
const db = require('./db')

const PORT = process.env.PORT || 9966

db.on('connected', () =>
  app.listen(PORT, (err) =>
    err ? console.error(err) : console.log('API now running on port', PORT)))
