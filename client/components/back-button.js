import React, {Component, PropTypes} from 'react'
import {Button} from 'react-bootstrap'

import Icon from './icon'
import actUponConfirmation from '../utils/ui'

export default class BackButton extends Component {
  static propTypes = {
    confirmBackMessage: PropTypes.string,
    goBack: PropTypes.func.isRequired
  }

  _onClick = () => {
    const {confirmBackMessage, goBack} = this.props
    if (confirmBackMessage) {
      actUponConfirmation(confirmBackMessage, goBack)
    } else {
      goBack()
    }
  }

  render () {
    return (
      <Button className='pull-right' onClick={this._onClick}>
        <Icon type='arrow-left' />
        <span>Back</span>
      </Button>
    )
  }
}
