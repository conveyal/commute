const db = require('../db')

module.exports = {
  Agency: db.model('Agency', require('./agency')),
  Analysis: db.model('Analysis', require('./analysis')),
  Commuter: db.model('Commuter', require('./commuter')),
  Group: db.model('Group', require('./group')),
  Organization: db.model('Organization', require('./organization')),
  Site: db.model('Site', require('./site'))
}
