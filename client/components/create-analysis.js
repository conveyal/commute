import React, {Component, PropTypes} from 'react'
import {Button, Col, ControlLabel, FormGroup, Grid, Row} from 'react-bootstrap'
import {Link} from 'react-router'
import Select from 'react-select'

import Icon from './icon'

export default class CreateAnalysis extends Component {
  static propTypes = {
    // dispatch
    create: PropTypes.func,

    // props
    organization: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  _handleGroupChange = (event) => {
    const groupId = event.value
    this.setState({
      commuters: this.props.organization.groupsById[groupId].commuters,
      groupId
    })
  }

  _handleSiteChange = (event) => {
    this.setState({ siteId: event.value })
  }

  _handleSubmit = () => {
    this.props.create(this.state, this.props.organization.id)
  }

  render () {
    const {groups, id: organizationId, sites} = this.props.organization
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h3>
              <span>Create Analysis</span>
              <Button className='pull-right'>
                <Link to={`/organizations/${organizationId}`}><Icon type='arrow-left' />Back</Link>
              </Button>
            </h3>
            <form>
              <FormGroup controlId='site-control'>
                <ControlLabel>Site</ControlLabel>
                <Select
                  onChange={this._handleSiteChange}
                  options={sites.map((site) => { return {value: site.id, label: site.name} })}
                  placeholder='Select a Site...'
                  value={this.state.siteId}
                  />
              </FormGroup>
              <FormGroup controlId='group-control'>
                <ControlLabel>Group</ControlLabel>
                <Select
                  onChange={this._handleGroupChange}
                  options={groups.map((group) => { return {value: group.id, label: group.name} })}
                  placeholder='Select a Commuter Group...'
                  value={this.state.groupId}
                  />
              </FormGroup>
              <Button
                bsStyle='success'
                onClick={this._handleSubmit}
                >
                Create
              </Button>
            </form>
          </Col>
        </Row>
      </Grid>
    )
  }
}
