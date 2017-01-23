import React, {Component, PropTypes} from 'react'
import {Button} from 'react-bootstrap'

import Icon from './icon'

export default class BackButton extends Component {
  static propTypes = {
    goBack: PropTypes.func.isRequired
  }

  _onClick = () => {
    this.props.goBack()
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
