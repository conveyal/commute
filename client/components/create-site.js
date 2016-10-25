import React, {Component, PropTypes} from 'react'
import {Button, Col, Grid, Row} from 'react-bootstrap'
import {Link} from 'react-router'
import Geocoder from 'react-select-geocoder'

import FieldGroup from './fieldgroup'
import Icon from './icon'
import {settings} from '../utils/env'

export default class CreateSite extends Component {
  static propTypes = {
    // props
    organizationId: PropTypes.string.isRequired,

    // dispatch
    create: PropTypes.func.isRequired
  }

  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value })
  }

  handleGeocoderChange = (value) => {
    this.setState({ address: value.properties.label })
  }

  handleSubmit = () => {
    this.props.create(Object.assign({ organizationId: this.props.organizationId }, this.state))
  }

  render () {
    const {organizationId} = this.props
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h3>Create Site
              <Button className='pull-right'>
                <Link to={`/organizations/${organizationId}`}><Icon type='arrow-left' />Back</Link>
              </Button>
            </h3>
            <form>
              <FieldGroup
                label='Name'
                name='name'
                onChange={this.handleChange}
                placeholder='Enter name'
                type='text'
                />
              <Geocoder
                apiKey={process.env.MAPZEN_SEARCH_KEY}
                focusLatlng={settings.mapzen_search.focus}
                onChange={this.handleGeocoderChange}
                />
              <FieldGroup
                label='Ridematch Radius (mi)'
                name='ridematch_radius'
                onChange={this.handleChange}
                placeholder='Enter radius'
                type='text'
                />
              <Button onClick={this.handleSubmit}>Create</Button>
            </form>
          </Col>
        </Row>
      </Grid>
    )
  }
}
