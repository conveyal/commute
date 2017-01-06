import React, {Component, PropTypes} from 'react'
import {Col, Grid, Row} from 'react-bootstrap'
import Form from 'react-formal'
import yup from 'yup'

import ButtonLink from './button-link'
import FormalFieldGroup from './formal-fieldgroup'
import Icon from './icon'

const analysisSchema = yup.object({
  name: yup.string().label('Analysis Name').required(),
  groupId: yup.string().label('Group').required(),
  siteId: yup.string().label('Site').required()
})

export default class CreateAnalysis extends Component {
  static propTypes = {
    // dispatch
    create: PropTypes.func.isRequired,

    // props
    groups: PropTypes.array.isRequired,
    groupsById: PropTypes.object.isRequired,
    organizationId: PropTypes.string.isRequired,
    sites: PropTypes.array.isRequired
  }

  componentWillMount () {
    this.state = {
      errors: {},
      model: { organizationId: this.props.organizationId }
    }
  }

  _handleSubmit = () => {
    const {model} = this.state
    model.numCommuters = this.props.groupsById[model.groupId].commuters.length
    this.props.create(model)
  }

  _setErrors = errors => this.setState({ errors })

  _setModel = model => this.setState({ model })

  render () {
    const {groups, organizationId, sites} = this.props
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h3>
              <span>Create Analysis</span>
              <ButtonLink
                className='pull-right'
                to={`/organization/${organizationId}`}
                >
                <Icon type='arrow-left' />
                <span>Back</span>
              </ButtonLink>
            </h3>
            <Form
              schema={analysisSchema}
              value={this.state.model}
              onChange={this._setModel}
              onError={this._setErrors}
              onSubmit={this._handleSubmit}
              >
              <FormalFieldGroup
                label='Analysis Name'
                name='name'
                placeholder='Enter name'
                validationState={this.state.errors.name ? 'error' : undefined}
                />
              <FormalFieldGroup
                data={sites}
                filter='contains'
                label='Site'
                mapFromValue={site => site._id}
                name='siteId'
                textField='name'
                type='dropdownlist'
                validationState={this.state.errors.siteId ? 'error' : undefined}
                valueField='_id'
                />
              <FormalFieldGroup
                data={groups}
                filter='contains'
                label='Group'
                mapFromValue={group => group._id}
                name='groupId'
                textField='name'
                type='dropdownlist'
                validationState={this.state.errors.groupId ? 'error' : undefined}
                valueField='_id'
                />
              <Form.Button
                type='submit'
                className='btn btn-success'
                >
                Create
              </Form.Button>
            </Form>
          </Col>
        </Row>
      </Grid>
    )
  }
}
