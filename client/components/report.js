import React, {Component, PropTypes} from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import Infographic from './site-helpers/infographic'
import SiteMap from './site-helpers/map'
import {AccessTable, RidematchesTable} from './site-helpers/tables'
import {
  modeStats,
  ridematches,
  summaryStats
} from '../utils/data'

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

  _getEntity () {
    const {
      isMultiSite,
      multiSite,
      site
    } = this.props
    return isMultiSite ? multiSite : site
  }

  _renderSection = (section, k) => {
    const {
      commuters,
      isMultiSite,
      lastCommuterStoreUpdateTime,
      polygonStore,
      selectedCommuter,
      site,
      sites
    } = this.props
    const entity = this._getEntity()
    const dataArgs = [
      lastCommuterStoreUpdateTime,
      entity._id,
      commuters,
      section.mode,
      true
    ]

    return (
      <div key={k} className='section'>
        {section.type === 'summary' && (
          <Infographic
            commuterCount={commuters.length}
            summaryStats={summaryStats(...dataArgs)}
            isMultiSite={isMultiSite}
            />
        )}

        {(section.type === 'map' || section.type === 'commuter-map') && (
          <div>
            <h3>
              {section.type === 'map'
                ? <span>{section.mode} Commute Access Map (up to {section.cutoff / 60} minutes)</span>
                : <span>Commuter Map</span>
              }
            </h3>
            <div className='map'>
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
          </div>
        )}

        {section.type === 'access-table' && (
          <AccessTable
            analysisModeStats={modeStats(...dataArgs)}
            mode={section.mode}
            />
        )}

        {section.type === 'ridematch-table' && (
          <RidematchesTable
            ridematchingAggregateTable={ridematches(...dataArgs).ridematchingAggregateTable}
            />
        )}
      </div>
    )
  }

  render () {
    const {
      commuters,
      numCommuters
    } = this.props

    const entity = this._getEntity()
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
                entity.reportConfig.sections.map(this._renderSection)
              }
            </div>
          </Col>
        </Row>
      </Grid>
    )
  }
}
