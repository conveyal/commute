import React, {Component, PropTypes} from 'react'
import {Button, Col, Grid, Row} from 'react-bootstrap'
import {Link} from 'react-router'

import Icon from './icon'

export default class Organizations extends Component {
  static propTypes = {
    organizations: PropTypes.array
  }

  render () {
    const {organizations} = this.props
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h2>Organizations
              <Button className='pull-right'>
                <Link to='/organizations/create'>Create a new organization <Icon type='shield' /></Link>
              </Button>
            </h2>
            <p>An organization is a collection of sites <Icon type='building' /> and commuters <Icon type='users' />.</p>
            <OrganizationsList organizations={organizations} />
          </Col>
        </Row>
      </Grid>
    )
  }
}

const OrganizationsList = ({organizations}) => (
  <table className='table table-striped'>
    <thead>
      <tr>
        <th>Name</th>
        <th>Sites</th>
        <th>Groups</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {organizations.length === 0 &&
        <tr>
          <td colSpan={4}>No Organizations have been created yet.</td>
        </tr>
      }
      {organizations.length > 0 &&
        organizations.map(({id, groups, name, sites}, idx) =>
          <tr key={idx}>
            <td><Link to={`/organizations/${id}`}>{name}</Link></td>
            <td>{sites.length}</td>
            <td>{groups.length}</td>
            <td />
          </tr>
        )
      }
    </tbody>
  </table>
)
