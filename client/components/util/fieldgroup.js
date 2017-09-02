import React from 'react'
import {ControlLabel, FormControl, FormGroup, HelpBlock} from 'react-bootstrap'

export default function FieldGroup ({ children, help, label, name, ...props }) {
  return (
    <FormGroup controlId={`group-item-${name}`}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl
        {...props}
        onChange={(e) => props.onChange(name, e)}
        value={props.value || ''}
        >
        {children}
      </FormControl>
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  )
}
