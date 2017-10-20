import React, {Component} from 'react'
import {Col, Grid, Row} from 'react-bootstrap'

export default function makeDataDependentComponent (dataHandler, ComponentToWrap) {
  class DataDependentComponent extends Component {
    state = {
      dataLoading: true
    }

    componentWillMount () {
      dataHandler.loadDataIfNeeded(this.props, this)
    }

    componentWillReceiveProps (nextProps) {
      dataHandler.loadDataIfNeeded(nextProps, this)
    }

    componentWillUnmount () {
      if (typeof dataHandler.unmount === 'function') {
        dataHandler.unmount(this)
      }
    }

    render () {
      return (
        this.state.dataLoading
          ? (
            <Grid>
              <Row>
                <Col xs={12}>
                  <h4>Loading data, please wait...</h4>
                </Col>
              </Row>
            </Grid>
          )
          : <ComponentToWrap {...this.props} />
      )
    }
  }

  return DataDependentComponent
}
