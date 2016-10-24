import React, {Component, PropTypes} from 'react'
import {Button, Col, Grid, Row} from 'react-bootstrap'
import {Link} from 'react-router'

import FieldGroup from './fieldgroup'
import Icon from './icon'

export default class CreateOrganization extends Component {
  static propTypes = {
    // dispatch
    create: PropTypes.func.isRequired
  }

  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value })
  }

  handleSubmit = () => {
    this.props.create(this.state)
  }

  render () {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h3>Create Organization
              <Button className='pull-right'>
                <Link to='/'><Icon type='arrow-left' />Back</Link>
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
              <FieldGroup
                label='Main URL'
                name='main_url'
                onChange={this.handleChange}
                placeholder='Enter url'
                type='text'
                />
              <FieldGroup
                label='Logo URL'
                name='logo_url'
                onChange={this.handleChange}
                placeholder='Enter logo url'
                type='text'
                />
              <FieldGroup
                label='Contact'
                name='contact'
                onChange={this.handleChange}
                placeholder='Enter contact'
                type='text'
                />
              <FieldGroup
                label='Email'
                name='email'
                onChange={this.handleChange}
                placeholder='Enter email'
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
