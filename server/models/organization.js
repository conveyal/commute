const {Schema} = require('mongoose')

const Organization = module.exports = new Schema({
  createdBy: String,
  name: String
})

Organization.methods.update = function (properties) {
  Object
    .keys(properties)
    .forEach((key) => {
      this[key] = properties[key]
    })
  return this.save()
}
