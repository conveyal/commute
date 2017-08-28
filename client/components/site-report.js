import React, {Component, PropTypes} from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import SiteMap from './site-map'
import SiteInfographic from './site-infographic'

import { processSite } from './site-common'

export default class SiteReport extends Component {
  static propTypes = {
    commuters: PropTypes.array,
    isMultiSite: PropTypes.bool,
    polygonStore: PropTypes.object,
    selectedCommuter: PropTypes.object,
    site: PropTypes.object,
    sites: PropTypes.array
  }

  render () {
    const { commuters, isMultiSite, polygonStore, selectedCommuter, site, sites } = this.props

    const processed = processSite(commuters, 'TRANSIT')
    return (
      <Grid>
        <Row ref='report'>
          <Col xs={12}>
            <div className='site-report'>
              <div className='header' style={{ height: '100px' }}>
                <div className='logo' />
              </div>

              <div className='intro'>
                <h2>Site Access Report for {site.name}</h2>
              </div>

              {site.reportConfig && site.reportConfig.sections && site.reportConfig.sections.map((section, k) => {
                return (
                  <div key={k} style={{ marginTop: '30px' }}>
                    {section.type === 'summary' && (
                      <SiteInfographic
                        commuterCount={commuters.length}
                        summaryStats={processed.summaryStats}
                        isMultiSite={isMultiSite}
                      />
                    )}

                    {section.type === 'map' && (<div>
                      <h3>{section.mode} Commute Access Map (up to {section.cutoff / 60} minutes)</h3>
                      <div style={{height: '600px', marginTop: '1em', marginBottom: '1em'}}>
                        <SiteMap ref='map'
                          commuters={commuters}
                          isMultiSite={isMultiSite}
                          polygonStore={polygonStore}
                          selectedCommuter={selectedCommuter}
                          site={site}
                          sites={sites}
                          activeTab='analysis'
                          analysisMode={section.mode}
                          analysisMapStyle='blue-solid'
                          commuterRingRadius={1}
                          isochroneCutoff={section.cutoff * 1.0}
                          rideMatchMapStyle='normal'
                          mapDisplayMode='STANDARD'
                        />
                      </div>
                    </div>)}
                  </div>
                )
              })}
            </div>
          </Col>
        </Row>
      </Grid>
    )
  }
}
