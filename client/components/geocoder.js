import React from 'react'
import {ControlLabel, FormGroup} from 'react-bootstrap'
import SelectGeocoder from 'react-select-geocoder'

import {settings} from '../utils/env'

const Geocoder = ({ label, ...props }) => (
  <FormGroup controlId='geocode-control'>
    <ControlLabel>{label}</ControlLabel>
    <SelectGeocoder
      apiKey={process.env.MAPZEN_SEARCH_KEY}
      focusLatlng={settings.map.focus}
      {...props}
      />
  </FormGroup>
)

export default Geocoder
