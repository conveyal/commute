import React from 'react'
import {ControlLabel, FormGroup} from 'react-bootstrap'
import Form from 'react-formal'
import SelectGeocoder from '@conveyal/react-select-geocoder-arcgis'

import settings from '../../utils/settings'

export default function Geocoder ({ label, validationState, ...props }) {
  return (
    <FormGroup
      controlId={`geocode-control-${props.name}`}
      validationState={validationState}
      >
      <ControlLabel>{label}</ControlLabel>
      <SelectGeocoder
        boundary={settings.geocoder.boundary}
        clientId={process.env.ARCGIS_CLIENT_ID}
        clientSecret={process.env.ARCGIS_CLIENT_SECRECT}
        forStorage
        {...props}
        />
      <Form.Message className='help-block' for={props.name} />
    </FormGroup>
  )
}
