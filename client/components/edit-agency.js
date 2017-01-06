import React, {Component, PropTypes} from 'react'
import {Button, ButtonGroup, Col, Grid, Row} from 'react-bootstrap'
import Form from 'react-formal'
import yup from 'yup'

import ButtonLink from './button-link'
import FormalFieldGroup from './formal-fieldgroup'
import Icon from './icon'
import {messages} from '../utils/env'
import {actUponConfirmation} from '../utils/ui'

const agencySchema = yup.object({
  name: yup.string().label('Agency Name').required()
})

export default class EditAgency extends Component {
  static propTypes = {
    // dispatch
    create: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,

    // props
    editMode: PropTypes.bool.isRequired,
    agency: PropTypes.object
  }

  state = { errors: {} }

  componentWillMount () {
    if (this.props.editMode) {
      this.setState({ model: this.props.agency })
    }
  }

  _handleDelete = () => {
    const doDelete = () => this.props.delete(this.props.agency)
    actUponConfirmation(messages.agency.deleteConfirmation, doDelete)
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
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h3>
              <span>{`${this.props.editMode ? 'Edit' : 'Create'} Agency`}</span>
              <ButtonLink
                className='pull-right'
                to='/'
                >
                <Icon type='arrow-left' />
                <span>Back</span>
              </ButtonLink>
            </h3>
            <Form
              schema={agencySchema}
              value={this.state.model}
              onChange={this._setModel}
              onError={this._setErrors}
              onSubmit={this._handleSubmit}
              >
              <FormalFieldGroup
                label='Agency Name'
                name='name'
                placeholder='Enter name'
                validationState={this.state.errors.name ? 'error' : undefined}
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
