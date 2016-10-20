const {graphql} = require('graphql')
const {schema, root} = require('./graphql')

module.exports.graphql = (event, context, callback) =>
  graphql(schema, event.body.query, root, {}, event.body.variables)
    .then((response) => callback(null, response))
    .catch((error) => callback(error))
