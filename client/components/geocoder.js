import React from 'react'
import {ControlLabel, FormGroup} from 'react-bootstrap'
import SelectGeocoder from 'react-select-geocoder'

import {settings} from '../utils/env'

const boundary = {
  circle: {
    latlng: settings.geocoder.focus,
    radius: settings.geocoder.focus.radius
  }
}

export default function Geocoder ({ label, ...props }) {
  return (
    <FormGroup controlId='geocode-control'>
      <ControlLabel>{label}</ControlLabel>
      <SelectGeocoder
        apiKey={process.env.MAPZEN_SEARCH_KEY}
        boundary={boundary}
        {...props}
        />
    </FormGroup>
  )
}
