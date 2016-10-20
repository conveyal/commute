const {buildSchema} = require('graphql')

const {
  Organization
} = require('./models')

const schema = buildSchema(`
  input Find {
    _id: ID
    owner: String
  }

  type Point {
    type: String!
    coordinates: [Float]
  }

  type Commuter {
    _id: ID!
    name: String!
    location: Point
  }

  type Group {
    _id: ID!
    name: String!
    organization: Organization!
    commuters: [Commuter]
  }

  type Organization {
    _id: ID!
    owner: String!
    name: String!
    update(name: String!): Organization
  }

  type Site {
    _id: ID!
    location: Point!
    organization: Organization!
  }

  type SiteAnalysis {
    _id: ID!
    group: Group!
    organization: Organization!
    site: Site!
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
      owner: request.user || 'Trevor',
      name: properties.name
    })
    return o.save()
  }
}

module.exports = {schema, rootValue}
