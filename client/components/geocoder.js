import React from 'react'
import {ControlLabel, FormGroup} from 'react-bootstrap'
import SelectGeocoder from 'react-select-geocoder'

import {settings} from '../utils/env'

const boundary = {
  circle: {
    latlng: settings.map.focus,
    radius: settings.map.focus.radius
  }
}

const Geocoder = ({ label, ...props }) => (
  <FormGroup controlId='geocode-control'>
    <ControlLabel>{label}</ControlLabel>
    <SelectGeocoder
      apiKey={process.env.MAPZEN_SEARCH_KEY}
      boundary={boundary}
      {...props}
      />
  </FormGroup>
)

export default Geocoder
