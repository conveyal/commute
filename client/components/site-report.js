import React, {Component} from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import SiteMap from './site-map'
import SiteInfographic from './site-infographic'
import { processSite } from './site-common'
import {pageview} from '../utils/analytics'

export default class SiteReport extends Component {
  componentWillMount () {
    pageview('/site/report')
  }

  render () {
    const { commuters, isMultiSite, polygonStore, selectedCommuter, site, sites } = this.props

    const processed = processSite(commuters, 'TRANSIT')
    return (
      <Grid>
        {/* <Row>
          <Col xs={12}>
            <Button onClick={() => { this._createPdf() }}>Generate PDF</Button>
          </Col>
        </Row> */}
        <Row ref='report'>
          <Col xs={12}>
            <div className='site-report'>
              <div className='header' style={{ height: '100px' }}>
                <div className='logo' />
              </div>

              <div className='intro'>
                Introductory Text Here
              </div>

              <SiteInfographic
                commuterCount={commuters.length}
                summaryStats={processed.summaryStats}
                isMultiSite={isMultiSite}
              />

              <div style={{height: '600px', marginTop: '1em', marginBottom: '1em'}}>
                <SiteMap ref='map'
                  commuters={commuters}
                  isMultiSite={isMultiSite}
                  polygonStore={polygonStore}
                  selectedCommuter={selectedCommuter}
                  site={site}
                  sites={sites}
                  activeTab='analysis'
                  analysisMode='TRANSIT'
                  analysisMapStyle='blue-solid'
                  commuterRingRadius={1}
                  isochroneCutoff={7200}
                  rideMatchMapStyle='normal'
                  mapDisplayMode='STANDARD'
                />
              </div>

              <Row>
                <Col xs={6}>
                  <h3>Transit Access Summary</h3>
                </Col>
                <Col xs={6}>
                  <h3>Carpool/Vanpool Potential Summary</h3>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Grid>
    )
  }
}
