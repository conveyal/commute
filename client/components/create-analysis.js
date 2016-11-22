import React, {Component, PropTypes} from 'react'
import {Button, Col, ControlLabel, FormGroup, Grid, Row} from 'react-bootstrap'
import {Link} from 'react-router'
import Select from 'react-select'

import FieldGroup from './fieldgroup'
import Icon from './icon'
import {entityIdArrayToEntityArray} from '../utils/entities'

export default class CreateAnalysis extends Component {
  static propTypes = {
    // dispatch
    create: PropTypes.func,

    // props
    commutersById: PropTypes.object.isRequired,
    groups: PropTypes.array.isRequired,
    organizationId: PropTypes.string.isRequired,
    sites: PropTypes.array.isRequired
  }

  componentWillMount () {
    this.state = {
      organizationId: this.props.organizationId
    }
  }

  _handleChange = (name, event) => {
    this.setState({ [name]: event.target.value })
  }

  _handleGroupChange = (event) => {
    const groupId = event.value
    this.setState({
      commuters: entityIdArrayToEntityArray(event.commuters, this.props.commutersById),
      groupId
    })
  }

  _handleSiteChange = (event) => {
    this.setState({ siteId: event.value })
  }

  _handleSubmit = () => {
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
                <Link to={`/organization/${organizationId}`}>
                  <Icon type='arrow-left' />
                  <span>Back</span>
                </Link>
              </Button>
            </h3>
            <form>
              <FieldGroup
                label='Name'
                name='name'
                onChange={this._handleChange}
                placeholder='Enter name'
                type='text'
                value={this.state.name}
                />
              <FormGroup controlId='site-control'>
                <ControlLabel>Site</ControlLabel>
                <Select
                  onChange={this._handleSiteChange}
                  options={sites.map((site) => { return {label: site.name, value: site.id} })}
                  placeholder='Select a Site...'
                  value={this.state.siteId}
                  />
              </FormGroup>
              <FormGroup controlId='group-control'>
                <ControlLabel>Group</ControlLabel>
                <Select
                  onChange={this._handleGroupChange}
                  options={groups.map((group) => {
                    return {
                      commuters: group.commuters,
                      label: group.name,
                      value: group.id
                    }
                  })}
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
