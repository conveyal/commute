import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'

import Icon from './icon'

export default class Organizations extends Component {
  static propTypes = {
    organizations: PropTypes.array
  }

  render () {
    const {organizations} = this.props
    return (
      <div>
        <h1><Link to='/organizations/create'>Create a new organization <Icon type='object-shield' /></Link></h1>
        <p>An organization is a collection of sites <Icon type='building' /> and commuters <Icon type='users' />.</p>
        <OrganizationsList organizations={organizations} />
      </div>
    )
  }
}

const OrganizationsList = ({organizations}) => {
  if (organizations.length === 0) {
    return (
      <p>No organizations found</p>
    )
  }
  return (
    <ul>
      {(organizations || []).map(({_id, name}) =>
        <li><Link to={`/organizations/${_id}`}>{name}</Link></li>)}
    </ul>
  )
}
