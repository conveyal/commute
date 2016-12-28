import React, {Component, PropTypes} from 'react'
import {ProgressBar} from 'react-bootstrap'

export default class ProgressManager extends Component {
  static propTypes = {
    numDone: PropTypes.number.isRequired,
    numTotal: PropTypes.number.isRequired,
    refreshFn: PropTypes.number.isRequired,
    intervalLengthMs: PropTypes.number.isRequired
  }

  state = {}

  componentWillMount () {
    const {intervalLengthMs, refreshFn} = this.props
    const pctComplete = this._calculatePctComplete(this.props)
    if (!this.state.interval && pctComplete < 100) {
      this.setState({
        interval: setInterval(refreshFn, intervalLengthMs)
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    const pctComplete = this._calculatePctComplete(nextProps)

    if (pctComplete === 100) {
      this._clearInterval()
    }
  }

  componentWillUnmount () {
    this._clearInterval()
  }

  _calculatePctComplete (props) {
    const {numDone, numTotal} = props
    const pctComplete = (numDone / numTotal) * 100

    this.setState({
      pctComplete,
      label: `${Math.round(pctComplete)}%`
    })

    return pctComplete
  }

  _clearInterval () {
    if (this.state.interval) {
      clearInterval(this.state.interval)
      this.setState({ interval: undefined })
    }
  }

  render () {
    return (
      <ProgressBar
        striped
        now={this.state.pctComplete}
        label={this.state.label}
        />
    )
  }
}
