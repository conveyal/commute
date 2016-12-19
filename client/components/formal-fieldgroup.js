import React from 'react'
import {ControlLabel, FormGroup} from 'react-bootstrap'
import Form from 'react-formal'

export default function FormalFieldGroup ({ label, name, validationState, ...props }) {
  return (
    <FormGroup
      controlId={`group-item-${name}`}
      validationState={validationState}
      >
      <ControlLabel>{label}</ControlLabel>
      <Form.Field
        className='form-control'
        {...props}
        name={name}
        />
      <Form.Message className='help-block' for={name} />
    </FormGroup>
  )
}
