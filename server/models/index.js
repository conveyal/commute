const db = require('../db')

module.exports = {
  Organization: db.model('Organization', require('./organization'))
}
