import React from 'react'
import {ControlLabel, FormGroup} from 'react-bootstrap'
import Form from 'react-formal'
import SelectGeocoder from 'react-select-geocoder'

import settings from '../../utils/settings'

export default function Geocoder ({ label, validationState, ...props }) {
  return (
    <FormGroup
      controlId={`geocode-control-${props.name}`}
      validationState={validationState}
      >
      <ControlLabel>{label}</ControlLabel>
      <SelectGeocoder
        apiKey={process.env.MAPZEN_SEARCH_KEY}
        boundary={settings.geocoder.boundary}
        {...props}
        />
      <Form.Message className='help-block' for={props.name} />
    </FormGroup>
  )
}
