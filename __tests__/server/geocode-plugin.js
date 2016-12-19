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
    lon: 34
  },
  country: 'Fake Country',
  county: 'Fake County',
  geocodeConfidence: 0.77,
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

  it.skip('should geocode model upon save if address provided, but no coordinates provided', async () => {
    prepareGeocodeNock()

    // create model
    const created = await model.create(omit(creationData, ['coordinate', 'geocodeConfidence']))
    console.log('created', created)

    // wait for geocoding to happen in next tick
    await timeoutPromise(1000)

    // get model
    const data = await model.find({ _id: created.id, trashed: undefined }).exec()

    // expect geocoded items
    const found = data[0]
    console.log('found', found)
    expect(found.coordinate.lat).toEqual(38.976745)
    expect(found.state).toEqual('Maryland')
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
