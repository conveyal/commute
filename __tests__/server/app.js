/* globals afterAll, beforeAll, describe, it */

const mongoose = require('mongoose')
import request from 'supertest-as-promised'

import app from '../../server/app'

describe('app', () => {
  beforeAll((done) => {
    setTimeout(done, 1000) // wait for mongo connection
  })
  afterAll(() => {
    mongoose.disconnect() // disconnect from mongo to end running of tests
  })
  it('should load base view', () => {
    return request(app)
      .get('/')
      .expect(200)
  })
})
