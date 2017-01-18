const fs = require('fs')

module.exports = function makeRoutes (app) {
  fs.readdirSync(__dirname)
    .filter((file) => /.*\.js/.test(file)) // only files that have .js extension
    .forEach((file) => {
      if (file === 'index.js') return
      const name = file.substr(0, file.indexOf('.'))
      require('./' + name)(app)
    })
}
