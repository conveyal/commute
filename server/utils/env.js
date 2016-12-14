const path = require('path')

const YAML = require('yamljs')

const envFolder = process.env.NODE_ENV === 'test' ? 'test' : 'default'
const configurationsFolder = path.resolve(`${__dirname}/../../configurations/`)

const env = {
  env: YAML.load(`${configurationsFolder}/${envFolder}/env.yml`),
  messages: YAML.load(`${configurationsFolder}/default/messages.yml`),
  settings: YAML.load(`${configurationsFolder}/default/settings.yml`)
}

module.exports = env
