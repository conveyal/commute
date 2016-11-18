import humanizeDuration from 'humanize-duration'
import React, {Component, PropTypes} from 'react'
import {Button, Col, Grid, Row} from 'react-bootstrap'
import {Link} from 'react-router'

import Icon from '../icon'
import {humanizeDistance} from '../../utils/components'
import {messages} from '../../utils/env'
import {actUponConfirmation} from '../../utils/ui'

export default class Summary extends Component {
  static propTypes = {
    // dispatch
    deleteAnalysis: PropTypes.func,

    // props
    analysis: PropTypes.object.isRequired,
    groupName: PropTypes.string.isRequired,
    organizationId: PropTypes.string.isRequired,
    siteName: PropTypes.string.isRequired
  }

  handleDelete () {
    const {analysis, deleteAnalysis, organizationId} = this.props
    const doDelete = () => {
      deleteAnalysis(analysis.id, organizationId)
    }
    actUponConfirmation(messages.analysis.deleteConfirmation, doDelete)
  }

  render () {
    const {id, name, summary} = this.props.analysis
    const {groupName, organizationId, siteName} = this.props
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h3>
              <span>{name}</span>
              <Button className='pull-right'>
                <Link to={`/organizations/${organizationId}`}><Icon type='arrow-left' />Back</Link>
              </Button>
            </h3>
          </Col>
          <Col xs={12} md={6}>
            <h4>
              <strong>Site:</strong>
              <span>{siteName}</span>
            </h4>
          </Col>
          <Col xs={12} md={6}>
            <h4>
              <strong>Group:</strong>
              <span>{groupName}</span>
            </h4>
          </Col>
          <Col xs={12}>
            <h4>
              <strong>Progress:</strong>
              <span>100%</span>
            </h4>
          </Col>
          <Col xs={12} md={4}>
            <h4>
              <strong>Potential Savings</strong>
            </h4>
          </Col>
          <Col xs={12} md={8}>
            <table className='table table-bordered'>
              <tbody>
                <tr>
                  <td>Total Costs Per Day</td>
                  <td>{`$${summary.savingsTotalPerDay}`}</td>
                </tr>
                <tr>
                  <td>Total Costs Per Year</td>
                  <td>{`$${summary.savingsTotalPerYear}`}</td>
                </tr>
                <tr>
                  <td>Cost Per Trip Per Day</td>
                  <td>{`$${summary.savingsPerTrip}`}</td>
                </tr>
                <tr>
                  <td>Cost Per Trip Per Year</td>
                  <td>{`$${summary.savingsPerTripYear}`}</td>
                </tr>
              </tbody>
            </table>
          </Col>
          <Col xs={12} md={4}>
            <h4>
              <strong>Mode Shift Stats</strong>
            </h4>
          </Col>
          <Col xs={12} md={8}>
            <table className='table table-bordered'>
              <tbody>
                <tr>
                  <td>Average Travel Time</td>
                  <td>{humanizeDuration(summary.avgTravelTime * 1000)}</td>
                </tr>
                <tr>
                  <td>Average Distance</td>
                  <td>{humanizeDistance(summary.avgDistance)}</td>
                </tr>
              </tbody>
            </table>
          </Col>
          <Col xs={12}>
            <p>
              <Link to={`/analysis/${id}/histogram`}>
                Commute Metrics Histogram
              </Link>
            </p>
            <p>
              <Link to={`/analysis/${id}/possibilities`}>
                Possibilities Analysis
              </Link>
            </p>
            <p>
              <Link to={`/analysis/${id}/individuals`}>
                Individual Commuter Analysis
              </Link>
            </p>
          </Col>
        </Row>
      </Grid>
    )
  }
}
