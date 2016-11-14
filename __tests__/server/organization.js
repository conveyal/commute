/* globals afterAll, beforeAll, describe, expect, it */

const mongoose = require('mongoose')
import request from 'supertest-as-promised'

import app from '../../server/app'

describe('organization', () => {
  beforeAll((done) => {
    setTimeout(done, 1000) // wait for mongo connection
  })
  afterAll(() => {
    mongoose.disconnect() // disconnect from mongo to end running of tests
  })
  it('should get organizations', () => {
    return request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ query: '{organizations{_id,owner,name}}' }))
      .then((res) => {
        const json = JSON.parse(res.text)
        expect(json).toMatchSnapshot()
      })
  })
})
