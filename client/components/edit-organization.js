import React, {Component, PropTypes} from 'react'
import {Button, ButtonGroup, Col, Grid, Row} from 'react-bootstrap'
import Form from 'react-formal'
import yup from 'yup'

import ButtonLink from './button-link'
import FormalFieldGroup from './formal-fieldgroup'
import Icon from './icon'
import {messages} from '../utils/env'
import {actUponConfirmation} from '../utils/ui'

const organizationSchema = yup.object({
  name: yup.string().label('Organization Name').required(),
  main_url: yup.string().label('Main URL').url(),
  logo_url: yup.string().label('Logo URL').url(),
  contact: yup.string().label('Contact'),
  email: yup.string().label('Email').email()
})

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

  state = { errors: {} }

  componentWillMount () {
    if (this.props.editMode) {
      this.setState({ model: this.props.organization })
    } else {
      this.setState({ model: { agencyId: this.props.agencyId } })
    }
  }

  _handleDelete = () => {
    const doDelete = () => this.props.delete(this.state.model)
    actUponConfirmation(messages.organization.deleteConfirmation, doDelete)
  }

  _handleSubmit = () => {
    if (this.props.editMode) {
      this.props.update(this.state.model)
    } else {
      this.props.create(this.state.model)
    }
  }

  _setErrors = errors => this.setState({ errors })

  _setModel = model => this.setState({ model })

  render () {
    const {agencyId} = this.props
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h3>
              <span>{`${this.props.editMode ? 'Edit' : 'Create'} Organization`}</span>
              <ButtonLink
                className='pull-right'
                to={`/agency/${agencyId}`}
                >
                <Icon type='arrow-left' />
                <span>Back</span>
              </ButtonLink>
            </h3>
            <Form
              schema={organizationSchema}
              value={this.state.model}
              onChange={this._setModel}
              onError={this._setErrors}
              onSubmit={this._handleSubmit}
              >
              <FormalFieldGroup
                label='Organization Name'
                name='name'
                placeholder='Enter name'
                validationState={this.state.errors.name ? 'error' : undefined}
                />
              <FormalFieldGroup
                label='Main URL'
                name='main_url'
                placeholder='Enter url'
                validationState={this.state.errors.main_url ? 'error' : undefined}
                />
              <FormalFieldGroup
                label='Logo URL'
                name='logo_url'
                placeholder='Enter url'
                validationState={this.state.errors.logo_url ? 'error' : undefined}
                />
              <FormalFieldGroup
                label='Contact'
                name='contact'
                placeholder='Enter contact'
                validationState={this.state.errors.contact ? 'error' : undefined}
                />
              <FormalFieldGroup
                label='Email'
                name='email'
                placeholder='Enter email'
                validationState={this.state.errors.email ? 'error' : undefined}
                />
              <ButtonGroup>
                <Form.Button
                  type='submit'
                  className={`btn ${this.props.editMode ? 'btn-warning' : 'btn-success'}`}
                  >
                  {this.props.editMode ? 'Update' : 'Create'}
                </Form.Button>
                {this.props.editMode &&
                  <Button
                    bsStyle='danger'
                    onClick={this._handleDelete}
                    >
                    Delete
                  </Button>
                }
              </ButtonGroup>
            </Form>
          </Col>
        </Row>
      </Grid>
    )
  }
}
