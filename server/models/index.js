const db = require('../db')

module.exports = {
  Commuter: db.model('Commuter', require('./commuter')),
  MultiSite: db.model('MultiSite', require('./multi-site')),
  Polygon: db.model('Polygon', require('./polygon')),
  Site: db.model('Site', require('./site'))
}
