import React, {Component, PropTypes} from 'react'
import { Row, Col } from 'react-bootstrap'

import Icon from '../util/icon'
import {formatPercentAsStr} from '../../utils'
import {modeshareStats} from '../../utils/settings'

const regionalTransitModePct = formatPercentAsStr(modeshareStats.transit)
const regionalBikeModePct = formatPercentAsStr(modeshareStats.bike)
const regionalCarpoolModePct = formatPercentAsStr(modeshareStats.carpool)

export default class SiteReport extends Component {
  static propTypes = {
    commuterCount: PropTypes.number,
    isMultiSite: PropTypes.bool,
    summaryStats: PropTypes.object
  }

  render () {
    const { commuterCount, isMultiSite, summaryStats } = this.props

    return (
      <div className='infographic'>
        <Row>
          <Col xs={3} className='infographic-site-column'>
            <h4>Total Commuters</h4>
            <div className='infographic-well' style={{backgroundColor: '#51992e'}}>
              <Icon type='group' />
              <span className='number'>{commuterCount}</span>
            </div>
            <p>
              {commuterCount}
              {isMultiSite
                ? ' commuters are at these sites.'
                : ' commuters are at this site.'}</p>
          </Col>
          <Col xs={3} className='infographic-site-column'>
            <h4>Transit Commute</h4>
            <div
              className='infographic-well'
              style={infographicBackground('#3b90c6', summaryStats.pctWith60MinTransit)}
              >
              <Icon type='bus' />
              <span className='number-pct'>{summaryStats.pctWith60MinTransit}</span>
            </div>
            <p>
              {summaryStats.pctWith60MinTransit} of commuters at
              {isMultiSite ? ' these sites ' : ' this site '}
              are within a 60 minute transit ride.
            </p>
          </Col>
          <Col xs={3} className='infographic-site-column'>
            <h4>Bike Commute</h4>
            <div
              className='infographic-well'
              style={infographicBackground('#f0a800', summaryStats.pctWith30MinBike)}
              >
              <Icon type='bicycle' />
              <span className='number-pct'>{summaryStats.pctWith30MinBike}</span>
            </div>
            <p>
              {summaryStats.pctWith30MinBike} of commuters at
              {isMultiSite ? ' these sites ' : ' this site '}
              can bike to work in 30 minutes or less.
            </p>
          </Col>
          <Col xs={3} className='infographic-site-column'>
            <h4>Carpool/Vanpool Commute</h4>
            <div
              className='infographic-well'
              style={infographicBackground('#ec684f', summaryStats.pctWithRidematch)}
              >
              <i className='icon-carshare' />
              <span className='number-pct'>{summaryStats.pctWithRidematch}</span>
            </div>
            <p>
              {summaryStats.pctWithRidematch} of commuters at
              {isMultiSite ? ' these sites ' : ' this site '}
              have a rideshare match within 1 mile or less of their homes.
            </p>
          </Col>
        </Row>

        <Row>
          <Col xs={3} className='infographic-modeshare-container'>
            <h4>Compare Against Washington, DC Averages</h4>
          </Col>
          <Col xs={3} className='infographic-modeshare-container'>
            <div
              className='infographic-modeshare-pct-bar'
              style={infographicBackground('#3b90c6', regionalTransitModePct)}
              />
            <p>
              {regionalTransitModePct} of all commuters in Washington, DC
              take transit to work.
            </p>
          </Col>
          <Col xs={3} className='infographic-modeshare-container'>
            <div
              className='infographic-modeshare-pct-bar'
              style={infographicBackground('#f0a800', regionalBikeModePct)}
              />
            <p>
              {regionalBikeModePct} of all commuters in Washington, DC
              bike to work.
            </p>
          </Col>
          <Col xs={3} className='infographic-modeshare-container'>
            <div
              className='infographic-modeshare-pct-bar'
              style={infographicBackground('#ec684f', regionalCarpoolModePct)}
              />
            <p>
              {regionalCarpoolModePct} of all commuters in Washington, DC
              carpool to work.
            </p>
          </Col>
        </Row>
      </div>
    )
  }
}

function infographicBackground (color, pct) {
  return {
    background: `linear-gradient(to right,
      ${color} 0%,
      ${color} ${pct},
      #b1b3af ${pct},
      #b1b3af 100%)`
  }
}
