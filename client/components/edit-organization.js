import React, {Component, PropTypes} from 'react'
import {Button, Col, Grid, Row} from 'react-bootstrap'
import {Link} from 'react-router'

import FieldGroup from './fieldgroup'
import Icon from './icon'

export default class EditOrganization extends Component {
  static propTypes = {
    // dispatch
    create: PropTypes.func,
    delete: PropTypes.func,
    update: PropTypes.func,

    // props
    organization: PropTypes.object
  }

  componentWillMount () {
    if (this.props.editMode) {
      this.setState({...this.props.organization})
    } else {
      this.state = {}
    }
  }

  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value })
  }

  handleDelete = () => {
    this.props.delete(this.props.organization.id)
  }

  handleSubmit = () => {
    if (this.props.editMode) {
      this.props.update(this.state)
    } else {
      this.props.create(this.state)
    }
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
                value={this.state.name}
                />
              <FieldGroup
                label='Main URL'
                name='main_url'
                onChange={this.handleChange}
                placeholder='Enter url'
                type='text'
                value={this.state.main_url}
                />
              <FieldGroup
                label='Logo URL'
                name='logo_url'
                onChange={this.handleChange}
                placeholder='Enter logo url'
                type='text'
                value={this.state.logo_url}
                />
              <FieldGroup
                label='Contact'
                name='contact'
                onChange={this.handleChange}
                placeholder='Enter contact'
                type='text'
                value={this.state.contact}
                />
              <FieldGroup
                label='Email'
                name='email'
                onChange={this.handleChange}
                placeholder='Enter email'
                type='text'
                value={this.state.email}
                />
              <Button
                bsStyle={this.props.editMode ? 'warning' : 'success'}
                onClick={this.handleSubmit}
                >
                {this.props.editMode ? 'Create' : 'Update'}
              </Button>
              {this.props.editMode &&
                <Button
                  bsStyle='danger'
                  onClick={this.handleDelete}
                  >
                  Delete
                </Button>
              }
            </form>
          </Col>
        </Row>
      </Grid>
    )
  }
}
