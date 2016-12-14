const path = require('path')

const YAML = require('yamljs')

const envFolder = process.env.NODE_ENV === 'test' ? 'test' : 'default'
const configurationsFolder = path.resolve(`${__dirname}/../../configurations/`)

// create env object with environment vars if in Heroku environment
let envObj
if (process.env.MONGODB_URI) {
  envObj = {
    MAPZEN_SEARCH_KEY: process.env.MAPZEN_SEARCH_KEY,
    OTP_URL: process.env.OTP_URL
  }
} else {
  envObj = YAML.load(`${configurationsFolder}/${envFolder}/env.yml`)
}

const env = {
  env: envObj,
  messages: YAML.load(`${configurationsFolder}/default/messages.yml`),
  settings: YAML.load(`${configurationsFolder}/default/settings.yml`)
}

module.exports = env
