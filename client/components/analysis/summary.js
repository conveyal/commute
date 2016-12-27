import currencyFormatter from 'currency-formatter'
import humanizeDuration from 'humanize-duration'
import React, {Component, PropTypes} from 'react'
import {Col, Grid, Row} from 'react-bootstrap'
import {Link} from 'react-router'

import ButtonLink from '../button-link'
import Icon from '../icon'
import ProgressManager from '../progress-manager'
import analysisDefaults from '../../utils/analysisDefaults'
import {humanizeDistance} from '../../utils/components'
import {messages} from '../../utils/env'
import {actUponConfirmation} from '../../utils/ui'

export default class Summary extends Component {
  static propTypes = {
    // dispatch
    deleteAnalysis: PropTypes.func.isRequired,
    loadAnalysis: PropTypes.func.isRequired,

    // props
    analysis: PropTypes.object.isRequired,
    groupName: PropTypes.string.isRequired,
    siteName: PropTypes.string.isRequired
  }

  _handleDelete () {
    const {analysis, deleteAnalysis, organizationId} = this.props
    const doDelete = () => {
      deleteAnalysis(analysis._id, organizationId)
    }
    actUponConfirmation(messages.analysis.deleteConfirmation, doDelete)
  }

  _loadAnalysis () {
    this.props.loadAnalysis(this.props.analysis._id)
  }

  render () {
    const {_id: analysisId, name, numCommuters, summary} = this.props.analysis
    const {analysis, groupName, siteName} = this.props
    const numTrips = analysis.trips.length
    const analysisCalculated = numCommuters === numTrips
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h3>
              <span>{name}</span>
              <ButtonLink
                className='pull-right'
                to={`/organization/${analysis.organizationId}`}
                >
                <Icon type='arrow-left' />
                <span>Back</span>
              </ButtonLink>
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
        </Row>
        {!analysisCalculated &&
          <Row>
            <Col xs={12}>
              <h4>Progress</h4>
              <ProgressManager
                numDone={numTrips}
                numTotal={numCommuters}
                refreshFn={() => this._loadAnalysis()}
                intervalLengthMs={2500}
                />
            </Col>
          </Row>
        }
        {analysisCalculated &&
          <Row>
            <Col xs={12} md={4}>
              <h4>
                <strong>Potential Savings</strong>
              </h4>
            </Col>
            <Col xs={12} md={8}>
              <table className='table table-bordered'>
                <tbody>
                  <tr>
                    <td>Savings Per Day</td>
                    <td>{formatCurrency(summary.savingsTotalPerDay)}</td>
                  </tr>
                  <tr>
                    <td>Savings Per Year</td>
                    <td>{formatCurrency(summary.savingsTotalPerYear)}</td>
                  </tr>
                  <tr>
                    <td>Savings Per Trip Per Day</td>
                    <td>{formatCurrency(summary.savingsPerTrip)}</td>
                  </tr>
                  <tr>
                    <td>Savings Per Trip Per Year</td>
                    <td>{formatCurrency(summary.savingsPerTripYear)}</td>
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
                    <td>{humanizeDuration(summary.avgTravelTime * 1000, { round: true })}</td>
                  </tr>
                  <tr>
                    <td>Average Distance</td>
                    <td>{humanizeDistance(summary.avgDistance / analysisDefaults.metrics.distance.multiplier)}</td>
                  </tr>
                </tbody>
              </table>
            </Col>
            <Col xs={12}>
              <p>
                <Link to={`/analysis/${analysisId}/histogram`}>
                  Commute Metrics Histogram
                </Link>
              </p>
              <p>
                <Link to={`/analysis/${analysisId}/possibilities`}>
                  Possibilities Analysis
                </Link>
              </p>
              <p>
                <Link to={`/analysis/${analysisId}/individuals`}>
                  Individual Commuter Analysis
                </Link>
              </p>
            </Col>
          </Row>
        }
      </Grid>
    )
  }
}

function formatCurrency (n) {
  return currencyFormatter.format(n, { code: 'USD' })
}
