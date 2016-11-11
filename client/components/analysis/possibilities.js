import humanizeDuration from 'humanize-duration'
import Slider from 'rc-slider'
import React, {Component, PropTypes} from 'react'
import {Button, Col, ControlLabel, FormControl, FormGroup, Grid, Panel, Row} from 'react-bootstrap'
import {Link} from 'react-router'
import {DiscreteColorLegend, HorizontalGridLines, VerticalBarSeries, YAxis} from 'react-vis'

import FlexiblePlot from '../flexible-plot'
import Icon from '../icon'
import {calcNumLessThan, getInitialSeries, humanizeDistance} from '../../utils/components'
import {settings} from '../../utils/env'

const METRICS = Object.keys(settings.metrics)

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
      cost: settings.metrics.cost.default,
      distance: settings.metrics.distance.default,
      series: getInitialSeries(),
      time: settings.metrics.time.default * 60,
      yAxisUnit: 'percent'
    }
  }

  componentWillMount () {
    // calculate with constraints
    this._calculateSeries({...this.state})
  }

  /**
   * Calculate series values given constraints for each mode
   *
   * @param  {Object} newState The new state to work with
   */
  _calculateSeries = (newState) => {
    const arrayVals = this.props.analysis.tripVals
    newState.series = newState.series.map((seriesMode) => {
      // populate all constraints
      const tripsByConstraint = []
      METRICS.forEach((metric) => {
        tripsByConstraint.push(calcNumLessThan(arrayVals[seriesMode.mode][metric], newState[metric]))
      })
      const constrainedNumber = Math.min.apply(this, tripsByConstraint)
      seriesMode.data = [{
        x: 1,
        y: (constrainedNumber /
          (newState.yAxisUnit === 'percent' ? this.props.analysis.trips.length * 0.01 : 1)
        ).toFixed(newState.yAxisUnit === 'percent' ? 1 : 0)
      }]
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

  _handleYAxisChange = (event) => {
    const newState = {...this.state}
    newState.yAxisUnit = event.target.value
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
    const {series, yAxisUnit} = this.state
    const activeSeries = series.filter((s) => !s.disabled)
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
          <Col xs={12} sm={9}>
            <FlexiblePlot
              animation
              height={300}
              >
              <HorizontalGridLines />
              {activeSeries
                .map((s, idx) =>
                  <VerticalBarSeries
                    color={s.color}
                    data={s.data}
                    key={`possibilities-series-${s.title}`}
                    />
                )
              }
              <YAxis title={yAxisUnit === 'percent' ? 'Percent' : 'Number of Commuters'} />
            </FlexiblePlot>
          </Col>
          <Col xs={12} sm={3} className='possibilities-legend-control'>
            <DiscreteColorLegend
              items={series}
              onItemClick={this._legendClickHandler}
              />
            <Panel>
              <FormGroup controlId='histogram-metric-select'>
                <ControlLabel>Y Axis</ControlLabel>
                <FormControl
                  componentClass='select'
                  onChange={this._handleYAxisChange}
                  value={yAxisUnit}
                  >
                  <option value='percent'>Percent</option>
                  <option value='number'>Number of Commuters</option>
                </FormControl>
              </FormGroup>
            </Panel>
          </Col>
          <Col xs={9}>
            <table className='table table-bordered'>
              <tbody>
                <tr>
                  {activeSeries
                    .map((s, idx) =>
                      <td key={idx}>
                        <span
                          className='rv-discrete-color-legend-item__color'
                          style={{background: s.color}}
                          />
                        <span
                          className='rv-discrete-color-legend-item__title'>
                          {`${s.title} - ${s.data[0].y}${yAxisUnit === 'percent' ? '%' : ''}`}
                        </span>
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
                defaultValue={settings.metrics.time.default}
                handle={
                  <CustomHandle
                    formatter={
                      // convert minutes to milliseconds
                      (v) => humanizeDuration(v * 60 * 1000)
                    }
                    />
                }
                max={settings.metrics.time.max}
                min={settings.metrics.time.min}
                onChange={this._handleTimeChange}
                />
            </Panel>
            <Panel>
              <p>Maximum Distance</p>
              <Slider
                defaultValue={settings.metrics.distance.default}
                handle={
                  <CustomHandle
                    formatter={humanizeDistance}
                    />}
                max={settings.metrics.distance.max}
                min={settings.metrics.distance.min}
                onChange={this._handleDistanceChange}
                />
            </Panel>
            <Panel>
              <p>Maximum Cost</p>
              <Slider
                defaultValue={settings.metrics.cost.default}
                handle={
                  <CustomHandle
                    formatter={(v) => `$${v}`}
                    />}
                max={settings.metrics.cost.max}
                min={settings.metrics.cost.min}
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
