import {Schema} from 'mongoose'

import geocodingPlugin from './plugins/geocode'

const schema = new Schema({
  address: String,
  group: {
    ref: 'Group',
    required: true,
    type: Schema.Types.ObjectId
  },
  location: {
    lat: Number,
    lon: Number
  },
  name: {
    required: true,
    type: String
  }
})

schema.plugin(geocodingPlugin)

export default schema
