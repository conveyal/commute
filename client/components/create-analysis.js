import React, {Component, PropTypes} from 'react'
import {Button, Col, Grid, Row} from 'react-bootstrap'
import {Link} from 'react-router'
import Select from 'react-select'

import Icon from './icon'

export default class CreateAnalysis extends Component {
  static propTypes = {
    // dispatch
    create: PropTypes.func,

    // props
    groups: PropTypes.array.isRequired,
    organizationId: PropTypes.string.isRequired,
    sites: PropTypes.array.isRequired
  }

  handleGroupChange = (event) => {
    this.setState({ groupId: event.id })
  }

  handleSiteChange = (event) => {
    this.setState({ siteId: event.id })
  }

  handleSubmit = () => {
    this.props.create(this.state, this.props.organizationId)
  }

  render () {
    const {groups, organizationId, sites} = this.props
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h3>
              <span>Create Analysis</span>
              <Button className='pull-right'>
                <Link to={`/organization/${organizationId}`}><Icon type='arrow-left' />Back</Link>
              </Button>
            </h3>
            <form>
              <Select
                options={sites.map((site) => { return {value: site.id, label: site.name} })}
                onChange={this.handleSiteChange}
                placeholder='Select a Site...'
                />
              <Select
                options={groups.map((group) => { return {value: group.id, label: group.name} })}
                onChange={this.handleGroupChange}
                placeholder='Select a Commuter Group...'
                />
              <Button
                bsStyle='success'
                onClick={this.handleSubmit}
                >
                'Create'
              </Button>
            </form>
          </Col>
        </Row>
      </Grid>
    )
  }
}
