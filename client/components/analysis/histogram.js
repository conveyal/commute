// import humanizeDuration from 'humanize-duration'
import React, {Component, PropTypes} from 'react'
import {Button, Col, ControlLabel, FormControl, FormGroup, Grid, Panel, Row} from 'react-bootstrap'
import {Link} from 'react-router'
import {
  Crosshair,
  DiscreteColorLegend,
  HorizontalGridLines,
  VerticalBarSeries,
  XAxis,
  YAxis
} from 'react-vis'

import {settings} from '../../utils/env'
import FlexiblePlot from '../flexible-plot'
import Icon from '../icon'
import {calcNumLessThan, getInitialSeries} from '../../utils/components'

const METRICS = Object.keys(settings.metrics)

export default class Histogram extends Component {
  static propTypes = {
    // dispatch
    deleteAnalysis: PropTypes.func,

    // props
    analysis: PropTypes.object.isRequired,
    groupName: PropTypes.string.isRequired,
    siteName: PropTypes.string.isRequired
  }

  state = {
    crosshairValues: [],
    metric: 'time',
    series: getInitialSeries()
  }

  componentWillMount () {
    // calculate with selected metric
    this._calculateSeries({...this.state})
  }

  /**
   * Calculate series values given selected metric
   *
   * @param  {Object} newState The new state to work with
   */
  _calculateSeries = (newState) => {
    const arrayVals = this.props.analysis.tripVals
    const metricData = settings.metrics[newState.metric]
    const multiplier = metricData.multiplier || 1

    // reset series data
    newState.series = newState.series.map((seriesMode) => {
      seriesMode.data = []
      seriesMode.numInPreviousBins = 0
      return seriesMode
    })

    // iterate through all bins of histogram
    for (let i = 0; i < metricData.max; i += metricData.step) {
      const upper = i + metricData.step
      const curBinLabel = `${i} - ${upper}`

      // calculate number of trips by mode that fall inside current bin
      newState.series.forEach((seriesMode) => {
        // find total num to left
        const numLess = calcNumLessThan(arrayVals[seriesMode.mode][newState.metric],
          upper * multiplier)

        // add bin
        seriesMode.data.push({ x: curBinLabel, y: numLess - seriesMode.numInPreviousBins })

        // update for next iteration
        seriesMode.numInPreviousBins = numLess
      })
    }

    // add those off edge
    newState.series.forEach((seriesMode) => {
      // add bin with remnant
      seriesMode.data.push({
        x: `> ${metricData.max}`,
        y: arrayVals[seriesMode.mode][newState.metric].length - seriesMode.numInPreviousBins
      })
    })

    this.setState(newState)
  }

  /**
   * Format the title line of the crosshair.
   * @param {Array} values Array of values.
   * @returns {Object} The caption and the value of the title.
   * @private
   */
  _formatCrosshairTitle = (values) => {
    return {
      title: settings.metrics[this.state.metric].unit,
      value: values[0].x
    }
  }

  /**
   * A callback to format the crosshair items.
   * @param {Object} values Array of values.
   * @returns {Array<Object>} Array of objects with titles and values.
   * @private
   */
  _formatCrosshairItems = (values) => {
    const {series} = this.state
    return values.map((v, i) => {
      return {
        title: series[i].title,
        value: v.y
      }
    })
  }

  /**
   * Handle the change of metric
   *
   * @param  {[type]} e [description]
   * @private
   */
  _handleMetricChange = (event) => {
    const newState = {...this.state}
    newState.metric = event.target.value
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

  /**
   * Event handler for onMouseLeave.
   * @private
   */
  _mouseLeaveHandler = () => {
    this.setState({crosshairValues: []})
  }

  /**
   * Event handler for onNearestX.
   * @param {Object} value Selected value.
   * @param {number} index Index of the series.
   * @private
   */
  _nearestXHandler = (value, {index}) => {
    const {series} = this.state
    this.setState({
      crosshairValues: series.map(s => s.data[index])
    })
  }

  render () {
    const {_id: analysisId, name} = this.props.analysis
    const {groupName, siteName} = this.props
    const {crosshairValues, metric: selectedMetric, series} = this.state
    return (
      <Grid>
        <Row className='histogram-header'>
          <Col xs={12}>
            <h3>
              <span>{name}</span>
              <Button className='pull-right'>
                <Link to={`/analysis/${analysisId}`}>
                  <Icon type='arrow-left' />
                  <span>Back</span>
                </Link>
              </Button>
            </h3>
            <h3>Commute Metrics Histogram</h3>
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
            <FlexiblePlot
              animation
              height={300}
              margin={{bottom: 70}}
              onMouseLeave={this._mouseLeaveHandler}
              xType='ordinal'
              >
              <Crosshair
                itemsFormat={this._formatCrosshairItems}
                titleFormat={this._formatCrosshairTitle}
                values={crosshairValues}
                />
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
              <XAxis
                tickLabelAngle={-45}
                title={settings.metrics[selectedMetric].unit}
                />
              <YAxis title='Number of Trips' />
            </FlexiblePlot>
          </Col>
          <Col xs={3}>
            <DiscreteColorLegend
              items={series}
              onItemClick={this._legendClickHandler}
              />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={8} className='histogram-settings'>
            <h4>Settings</h4>
            <Panel>
              <FormGroup controlId='histogram-metric-select'>
                <ControlLabel>Metric</ControlLabel>
                <FormControl
                  componentClass='select'
                  onChange={this._handleMetricChange}
                  value={selectedMetric}
                  >
                  {METRICS.map((metric) => {
                    return <option value={metric}>{metric}</option>
                  })}
                </FormControl>
              </FormGroup>
            </Panel>
          </Col>
        </Row>
      </Grid>
    )
  }
}
