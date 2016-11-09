import humanizeDuration from 'humanize-duration'
import Slider from 'rc-slider'
import React, {Component, PropTypes} from 'react'
import {Button, Col, Grid, Panel, Row} from 'react-bootstrap'
import {Link} from 'react-router'
import {
  DiscreteColorLegend,
  HorizontalGridLines,
  makeWidthFlexible,
  VerticalBarSeries,
  XYPlot,
  YAxis
} from 'react-vis'

import {calcNumLessThan, humanizeDistance} from '../../utils/components'
import {settings} from '../../utils/env'
import Icon from '../icon'

const FlexibleXYPlot = makeWidthFlexible(XYPlot)

const DEFAULT_COST = 20
const DEFAULT_DISTANCE = 25
const DEFAULT_TIME = 30
const METRICS = ['cost', 'distance', 'time']

export default class Possibilities extends Component {
  static propTypes = {
    // dispatch
    deleteAnalysis: PropTypes.func,

    // props
    analysis: PropTypes.object.isRequired,
    groupName: PropTypes.string.isRequired,
    organizationId: PropTypes.string.isRequired,
    siteName: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      cost: DEFAULT_COST,
      distance: DEFAULT_DISTANCE,
      time: DEFAULT_TIME * 60
    }
  }

  componentWillMount () {
    const newState = {...this.state}

    // calculate array of values for each metric
    this.vals = {}
    const trips = this.props.analysis.trips
    const modes = Object.keys(trips[0]).filter((mode) => (['commuterId']).indexOf(mode) === -1)
    modes.forEach((mode) => {
      this.vals[mode] = {
        cost: [],
        distance: [],
        time: []
      }
    })
    trips.forEach((trip) =>
      modes.forEach((mode) =>
        METRICS.forEach((metric) => {
          this.vals[mode][metric].push(trip[mode][metric])
        })
      )
    )

    // sort arrays
    modes.forEach((mode) =>
      METRICS.forEach((metric) => {
        this.vals[mode][metric].sort()
      })
    )

    const series = []

    modes.forEach((mode) => {
      series.push(Object.assign({mode}, settings.modeDisplay[mode]))
    })

    newState.series = series

    // calculate with constraints
    this._calculateSeries(newState)
  }

  _calculateSeries = (newState) => {
    // calculate constraints for each mode
    newState.series = newState.series.map((seriesMode) => {
      // populate all constraints
      const tripsByConstraint = []
      METRICS.forEach((metric) => {
        tripsByConstraint.push(calcNumLessThan(this.vals[seriesMode.mode][metric], newState[metric]))
      })
      const constrainedPct = Math.min.apply(this, tripsByConstraint)
      seriesMode.data = [{ x: 1, y: constrainedPct }]
      return seriesMode
    })

    this.setState(newState)
  }

  _handleCostChange = (v) => {
    const newState = {...this.state}
    newState.cost = v
    this._calculateSeries(newState)
  }

  _handleDistanceChange = (v) => {
    const newState = {...this.state}
    newState.distance = v
    this._calculateSeries(newState)
  }

  _handleTimeChange = (v) => {
    const newState = {...this.state}
    newState.time = v * 60
    this._calculateSeries(newState)
  }

  /**
   * Click handler for the legend.
   * @param {Object} item Clicked item of the legend.
   * @param {number} i Index of the legend.
   * @private
   */
  _legendClickHandler = (item, i) => {
    const {series} = this.state
    series[i].disabled = !series[i].disabled
    this.setState({series})
  }

  render () {
    const {id, name} = this.props.analysis
    const {groupName, organizationId, siteName} = this.props
    const {series} = this.state
    return (
      <Grid>
        <Row className='possibilities-header'>
          <Col xs={12}>
            <h3>
              <span>{name}</span>
              <Button className='pull-right'>
                <Link to={`/organizations/${organizationId}/analysis/${id}`}>
                  <Icon type='arrow-left' />
                  <span>Back</span>
                </Link>
              </Button>
            </h3>
            <h3>Possibilities Analysis</h3>
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
        <Row>
          <Col xs={9}>
            <FlexibleXYPlot
              animation
              height={300}
              >
              <HorizontalGridLines />
              {series
                .filter((s) => !s.disabled)
                .map((s, idx) =>
                  <VerticalBarSeries
                    color={s.color}
                    data={s.data}
                    key={`possibilities-series-${s.title}`}
                    onNearestX={this._nearestXHandler}
                    />
                )
              }
              <YAxis title='Percent' />
            </FlexibleXYPlot>
          </Col>
          <Col xs={3}>
            <DiscreteColorLegend
              items={series}
              onItemClick={this._legendClickHandler}
              />
          </Col>
          <Col xs={9}>
            <table className='table table-bordered'>
              <tbody>
                <tr>
                  {series
                    .filter((s) => !s.disabled)
                    .map((s, idx) =>
                      <td key={idx}>
                        <span className='rv-discrete-color-legend-item__color' style={{background: s.color}} />
                        <span className='rv-discrete-color-legend-item__title'>{s.title}</span>
                      </td>
                    )
                  }
                </tr>
              </tbody>
            </table>
          </Col>
          <Col xs={12} className='possibilities-settings'>
            <h4>Settings</h4>
            <Panel>
              <p>Maximum Travel Time</p>
              <Slider
                defaultValue={DEFAULT_TIME}
                handle={
                  <CustomHandle
                    formatter={
                      // convert minutes to milliseconds
                      (v) => humanizeDuration(v * 60 * 1000)
                    }
                    />
                }
                max={200}
                min={0}
                onChange={this._handleTimeChange}
                />
            </Panel>
            <Panel>
              <p>Maximum Distance</p>
              <Slider
                defaultValue={DEFAULT_DISTANCE}
                handle={
                  <CustomHandle
                    formatter={humanizeDistance}
                    />}
                max={100}
                min={0}
                onChange={this._handleDistanceChange}
                />
            </Panel>
            <Panel>
              <p>Maximum Cost</p>
              <Slider
                defaultValue={DEFAULT_COST}
                handle={
                  <CustomHandle
                    formatter={(v) => `$${v}`}
                    />}
                max={100}
                min={0}
                onChange={this._handleCostChange}
                />
            </Panel>
          </Col>
        </Row>
      </Grid>
    )
  }
}

const handleStyle = {
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  cursor: 'pointer',
  padding: '2px',
  border: '2px solid #abe2fb',
  borderRadius: '3px',
  background: '#fff',
  fontSize: '14px',
  textAlign: 'center'
}

const CustomHandle = props => {
  const style = Object.assign({ left: `${props.offset}%` }, handleStyle)
  return (
    <div style={style}>{props.formatter(props.value)}</div>
  )
}

CustomHandle.propTypes = {
  formatter: PropTypes.func.isRequired,
  offset: PropTypes.number,
  value: PropTypes.any
}
