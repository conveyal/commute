import React, {Component, PropTypes} from 'react'
import {Button, Col, Grid, Row} from 'react-bootstrap'
import {Link} from 'react-router'

import FieldGroup from './fieldgroup'
import Icon from './icon'
import {messages} from '../utils/env'
import {actUponConfirmation} from '../utils/ui'

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

  componentWillMount () {
    if (this.props.editMode) {
      this.setState({...this.props.agency})
    } else {
      this.state = {}
    }
  }

  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value })
  }

  handleDelete = () => {
    const doDelete = () => this.props.delete(this.props.agency)
    actUponConfirmation(messages.agency.deleteConfirmation, doDelete)
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
            <h3>
              <span>{`${this.props.editMode ? 'Edit' : 'Create'} Agency`}</span>
              <Button className='pull-right'>
                <Link to='/'>
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
