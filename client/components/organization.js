import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'

import Icon from './icon'

export default class Organization extends Component {
  static propTypes = {
    _id: PropTypes.string.isRequired,
    groups: PropTypes.array,
    name: PropTypes.string.isRequired,
    sites: PropTypes.array
  }

  render () {
    const {_id, groups, name, sites} = this.props
    return (
      <div>
        <h1>{name} <Icon type='object-ungroup' /></h1>
        <p>Below are this organization's sites and commuter groups.</p>
        <h1><Link to={`/organizations/${_id}/sites/create`}>Create a new site <Icon type='building' /></Link></h1>
        <p>A site is a location of a building or new address that you want to use as the centerpoint of your commutes.</p>
        <ul><ListSites sites={sites} /></ul>
        <h1><Link to={`/organizations/${_id}/groups/create`}>Create a new group <Icon type='users' /></Link></h1>
        <ul><ListGroups groups={groups} /></ul>
      </div>
    )
  }
}

const ListSites = ({sites}) =>
  (sites || []).map(({_id, organization, name}) =>
    <li><Link to={`/organizations/${organization}/sites/${_id}/`}>{name}</Link></li>)

const ListGroups = ({groups}) =>
  (groups || []).map(({_id, organization, name}) =>
    <li><Link to={`/organizations/${organization}/groups/${_id}`}>{name}</Link></li>)
