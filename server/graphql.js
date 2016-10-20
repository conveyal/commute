const {buildSchema} = require('graphql')

const {
  Organization
} = require('./models')

const schema = buildSchema(`
  input Find {
    _id: ID
    createdBy: String
  }

  type Organization {
    _id: ID!
    createdBy: String!
    name: String!
    update(name: String!): Organization
  }

  type Query {
    organization(find: Find): Organization
    organizations: [Organization]
  }

  type Mutation {
    createOrganization(name: String!): Organization
    organization(_id: ID!): Organization
  }
`)

const rootValue = {
  organization ({find}, request) {
    return Organization.findOne(find).exec()
  },
  organizations (properties, request) {
    return Organization
      .find()
      .exec()
  },
  createOrganization (properties, request) {
    const o = new Organization({
      createdBy: request.user || 'Trevor',
      name: properties.name
    })
    return o.save()
  }
}

module.exports = {schema, rootValue}
