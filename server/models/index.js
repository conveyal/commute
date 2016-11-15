const db = require('../db')

module.exports = {
  Commuter: db.model('Commuter', require('./commuter')),
  Group: db.model('Group', require('./group')),
  Organization: db.model('Organization', require('./organization')),
  Analysis: db.model('Analysis', require('./analysis')),
  Site: db.model('Site', require('./site'))
}
