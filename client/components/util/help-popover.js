import React from 'react'
import {Button, Popover, OverlayTrigger} from 'react-bootstrap'

import Icon from './icon'
import messages from '../../utils/messages'

export default function HelpPopover ({ type }) {
  const popover = (
    <Popover title={messages.docs[type].title} id={type} className='help-popover'>
      {messages.docs[type].body}
      {messages.docs[type].url &&
        <div className='button-row'><Button bsStyle='primary' bsSize='small' href={messages.docs[type].url}>
          View Full Documentation
        </Button></div>}
    </Popover>
  )

  return (
    <span className='help-popover-trigger'>
      <OverlayTrigger placement='top' overlay={popover} trigger='focus'>
        <Button bsSize='small' className='help-button'><Icon type='question-circle' /></Button>
      </OverlayTrigger>
    </span>
  )
}
