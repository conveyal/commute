import React from 'react'
import {Col, ProgressBar, Row} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'

import {capitalize, formatPercent, formatPercentAsStr} from '../../utils'

const accessDescriptor = {
  BICYCLE: 'bicycle',
  CAR: 'drive (without any traffic)',
  TRANSIT: 'take transit',
  WALK: 'walk'
}

export function AccessTable (props) {
  const {analysisModeStats, mode} = props
  return (
    <div>
      <h4>Commuter Travel Time Summary ({capitalize(mode.toLowerCase())})</h4>
      <p>
        This table provides a summary of the distribution of travel times to work.
        Each row shows how many commuters can {accessDescriptor[mode]} to work
        up to the travel time listed.
      </p>
      <BootstrapTable data={analysisModeStats}>
        <TableHeaderColumn dataField='bin' isKey width='150'>Travel Time to<br />Work (minutes)</TableHeaderColumn>
        <TableHeaderColumn dataField='cumulative' width='100'>Number of<br />Commuters</TableHeaderColumn>
        <TableHeaderColumn
          dataField='cumulativePct'
          dataFormat={percentBar}
          >
          Percent of Commuters
        </TableHeaderColumn>
      </BootstrapTable>
    </div>
  )
}

function percentBar (n) {
  return <Row>
    <Col xs={9}>
      <ProgressBar
        className='percent-bar-progress'
        now={formatPercent(n)}
        />
    </Col>
    <Col xs={3}>{formatPercentAsStr(n)}</Col>
  </Row>
}

export function RidematchesTable (props) {
  return (
    <div>
      <h4>Ridematch Summary</h4>
      <p>
        This table provides a summary of the distribution of commuter ridematches.
        Each row shows how many commuters have another commuter located within the
        current distance listed (as the crow flies).
      </p>
      <BootstrapTable data={props.ridematchingAggregateTable}>
        <TableHeaderColumn dataField='bin' isKey>Ridematch radius (miles)</TableHeaderColumn>
        <TableHeaderColumn dataField='cumulative'>Number of Commuters</TableHeaderColumn>
        <TableHeaderColumn
          dataField='cumulativePct'
          dataFormat={percentBar}
          >
          Percent of Commuters
        </TableHeaderColumn>
      </BootstrapTable>
    </div>
  )
}
