import React, {Component, PropTypes} from 'react'
import {Button, Col, Grid, Row} from 'react-bootstrap'
import {Link} from 'react-router'

import FieldGroup from './fieldgroup'
import Icon from './icon'
import {messages} from '../utils/env'
import {actUponConfirmation} from '../utils/ui'

export default class EditOrganization extends Component {
  static propTypes = {
    // dispatch
    create: PropTypes.func,
    delete: PropTypes.func,
    update: PropTypes.func,

    // props
    agencyId: PropTypes.string,
    editMode: PropTypes.bool.isRequired,
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
    const doDelete = () => this.props.delete(this.props.agencyId, this.props.organization.id)
    actUponConfirmation(messages.organization.deleteConfirmation, doDelete)
  }

  handleSubmit = () => {
    if (this.props.editMode) {
      this.props.update(this.state)
    } else {
      this.props.create(this.state)
    }
  }

  render () {
    const {agencyId} = this.props
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h3>
              <span>{`${this.props.editMode ? 'Edit' : 'Create'} Organization`}</span>
              <Button className='pull-right'>
                <Link to={`/agency/${agencyId}`}>
                  <Icon type='arrow-left' />
                  <span>Back</span>
                </Link>
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
                {this.props.editMode ? 'Update' : 'Create'}
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
