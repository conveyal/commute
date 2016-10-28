import React from 'react'
import {ControlLabel, FormControl, FormGroup, HelpBlock} from 'react-bootstrap'

const FieldGroup = ({ help, label, name, ...props }) => (
  <FormGroup controlId={`group-item-${name}`}>
    <ControlLabel>{label}</ControlLabel>
    <FormControl
      {...props}
      onChange={(e) => props.onChange(name, e)}
      value={props.value || ''}
      />
    {help && <HelpBlock>{help}</HelpBlock>}
  </FormGroup>
)

export default FieldGroup
