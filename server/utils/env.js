const path = require('path')

const YAML = require('yamljs')

const configurationsFolder = path.resolve(`${__dirname}/../../configurations/default/`)

const env = {
  env: YAML.load(`${configurationsFolder}/env.yml`),
  messages: YAML.load(`${configurationsFolder}/messages.yml`),
  settings: YAML.load(`${configurationsFolder}/settings.yml`)
}

module.exports = env
