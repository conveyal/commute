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
    lat: Float
    lon: Float
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
  }

  type Site {
    _id: ID!
    address: String!
    location: Point!
    organization: Organization!
  }

  type Trip {
    mostLikely: String
  }

  type Analysis {
    _id: ID!
    group: Group!
    organization: Organization!
    site: Site!
    trips: [Trip]
  }

  type Query {
    organization(find: Find): Organization
    organizations: [Organization]
  }

  input SiteInput {
    address: String!
    location: Point!
    name: String!
  }

  type Mutation {
    createOrganization(name: String!): Organization
    deleteOrganization(name: String!): Organization
    organization(_id: ID!): Organization
    updateOrganization(name: String! newName: String!): Organization
    createSite(organizationId: String! site: SiteInput!): Site
  }
`)

const rootValue = {
  createOrganization (properties, request) {
    const o = new Organization({
      owner: request.user || 'Trevor',
      name: properties.name
    })
    return o.save()
  },
  createSite (properties, request) {
    return {}
  },
  deleteOrganization (properties, request) {
    return Organization
      .findOne({ name: properties.name })
      .exec((res) => {
        return Organization.remove(res).exec()
      })
  },
  organization ({find}, request) {
    return Organization.findOne(find).exec()
  },
  organizations (properties, request) {
    return Organization
      .find()
      .exec()
  },
  updateOrganization (properties, request) {
    return Organization.findOneAndUpdate({
      name: properties.name
    }, {
      name: properties.newName
    }).exec()
  }
}

module.exports = {schema, rootValue}
