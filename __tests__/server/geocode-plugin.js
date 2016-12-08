/* globals afterAll, afterEach, beforeEach, describe, expect, it */

import omit from 'lodash.omit'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

import {expectDeepEqual, timeoutPromise} from '../test-utils/common'
import {makeRemoveModelsFn, prepareGeocodeNock} from '../test-utils/server'

import db from '../../server/db'
import geocdePlugin from '../../server/models/plugins/geocode'

const schema = new Schema({
  name: {
    required: true,
    type: String
  }
})

schema.plugin(geocdePlugin)

const model = db.model('geocode-test-model', schema)

const creationData = {
  name: 'Mock model',
  address: '123 main st',
  city: 'Fake City',
  coordinate: {
    lat: 12,
    lng: 34
  },
  country: 'Fake Country',
  county: 'Fake County',
  neighborhood: 'Fake Neighborhood',
  original_address: '123 main st',
  state: 'Fake State'
}

describe('geocoder plugin', () => {
  beforeEach(makeRemoveModelsFn(model))
  afterEach(makeRemoveModelsFn(model))
  afterAll(() => {
    mongoose.disconnect() // disconnect from mongo to end running of tests
  })

  it('should geocode model upon save if address provided, but no coordinates provided', async () => {
    prepareGeocodeNock()

    // create model
    await model.create(omit(creationData, 'coordinate'))

    // wait for geocoding to happen in next tick
    await timeoutPromise(200)

    // get model
    const data = await model.find().exec()

    // expect non-geocoded items
    const created = data[0]
    expect(created.coordinate.lat).toEqual(38.976745)
    expect(created.state).toEqual('Maryland')
  })

  it('should not geocode model upon save if coordinates provided already', async () => {
    prepareGeocodeNock()

    // create model
    await model.create(creationData)

    // wait for geocoding to happen in next tick
    await timeoutPromise(100)

    // get model
    const data = await model.find().exec()

    // expect non-geocoded items
    expectDeepEqual(omit(data[0]._doc, ['_id', '__v']), creationData)
  })
})
