import React, {Component, PropTypes} from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import SiteMap from './site-helpers/map'
import SiteInfographic from './site-helpers/infographic'
import { processSite } from '../utils/data'

export default class SiteReport extends Component {
  static propTypes = {
    commuters: PropTypes.array,
    isMultiSite: PropTypes.bool,
    lastCommuterStoreUpdateTime: PropTypes.number,
    multiSite: PropTypes.object,
    polygonStore: PropTypes.object,
    selectedCommuter: PropTypes.object,
    site: PropTypes.object,
    sites: PropTypes.array
  }

  render () {
    const {
      commuters,
      isMultiSite,
      lastCommuterStoreUpdateTime,
      multiSite,
      numCommuters,
      polygonStore,
      selectedCommuter,
      site,
      sites
    } = this.props

    const entity = isMultiSite ? multiSite : site
    const loadingCommuters = numCommuters > commuters.length

    return (
      <Grid>
        <Row ref='report'>
          <Col xs={12}>
            <div className='report'>
              <div className='header' style={{ height: '100px' }}>
                <div className='logo' />
              </div>

              <div className='intro'>
                <h2>Site Access Report for {entity.name}</h2>
              </div>

              {loadingCommuters &&
                <h4>Loading data, please wait...</h4>
              }

              {!loadingCommuters &&
                entity.reportConfig &&
                entity.reportConfig.sections &&
                entity.reportConfig.sections.map((section, k) => {
                  let processed
                  if (section.mode) {
                    processed = processSite(
                      lastCommuterStoreUpdateTime,
                      entity._id,
                      commuters,
                      section.mode
                    )
                  }
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
                }
              )}
            </div>
          </Col>
        </Row>
      </Grid>
    )
  }
}
