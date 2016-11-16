import {Schema} from 'mongoose'

import geocodingPlugin from './plugins/geocode'

const schema = new Schema({
  address: String,
  location: {
    lat: Number,
    lon: Number
  },
  name: {
    required: true,
    type: String
  },
  organization: {
    ref: 'Organization',
    required: true,
    type: Schema.Types.ObjectId
  }
})

schema.plugin(geocodingPlugin)

export default schema
