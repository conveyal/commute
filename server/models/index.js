const db = require('../db')

module.exports = {
  Commuter: db.model('Commuter', require('./commuter')),
  MultiSite: db.model('MultiSite', require('./multi-site')),
  Site: db.model('Site', require('./site'))
}
