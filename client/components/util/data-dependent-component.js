import React, {Component} from 'react'
import {Col, Grid, Row} from 'react-bootstrap'

import {entityMapToEntityArray} from '../../utils/entities'

export default function makeDataDependentComponent (type, ComponentToWrap) {
  class DataDependentComponent extends Component {
    state = {
      dataLoading: true
    }

    componentWillMount () {
      this._loadDataIfNeeded(this.props)
    }

    componentWillReceiveProps (nextProps) {
      this._loadDataIfNeeded(nextProps)
    }

    componentWillUnmount () {
      if (this.loadSiteTimeout) {
        clearTimeout(this.loadSiteTimeout)
      }

      if (this.loadCommutersTimeout) {
        clearTimeout(this.loadCommutersTimeout)
      }

      this.loadingPolygons = false
    }

    /**
     * Function that loads data potentially missing from store
     *
     * @param  {object} props
     */
    _loadDataIfNeeded (props) {
      const {
        commuter,
        commuters,
        isMultiSite,
        loadCommuter,
        loadCommuters,
        loadMultiSite,
        loadPolygons,
        loadSite,
        loadSites,
        multiSite,
        params,
        polygonStore,
        router,
        site,
        sites
      } = props

      const isPublic = router.location.pathname.indexOf('/public') === 0

      if (type.indexOf('multi-site') > -1) {
        if (type === 'multi-site-only') {
          if ((
            (params && params.multiSiteId && !multiSite) ||
            (!params.multiSiteId)
          ) && !this.loadingInitialData) {
            // edit or create page, load all sites
            this.loadingInitialData = true
            this.loadingInitialData2 = true
            loadSites({
              isPublic,
              queryParams: {
                _id: {
                  $in: multiSite.sites
                },
                requester: {
                  entity: 'multi-site',
                  id: params.multiSiteId
                }
              }
            })
            if (params && params.multiSiteId) {
              // edit page, load multisite
              loadMultiSite({ id: params.multiSiteId, isPublic })
            }
            return
          }
        } else if (!multiSite && !this.loadingInitialData) {
          // pageload on multiSite, load multiSite and all of its sites
          this.loadingInitialData = true
          return loadMultiSite({ id: params.multiSiteId, isPublic })
        } else if (
          multiSite &&
          multiSite.sites.length > sites.length &&
          !this.loadingInitialData2
        ) {
          this.loadingInitialData2 = true
          return loadSites({
            isPublic,
            queryParams: {
              _id: {
                $in: multiSite.sites
              },
              requester: {
                entity: 'multi-site',
                id: params.multiSiteId
              }
            }
          })
        }
      } else if (type === 'site' || type === 'site-only') {
        if (!params || !params.siteId) {
          // creation page, no need to load
          return this.setState({ dataLoading: false })
        } else if (!site && !this.loadingInitialData) {
          // pageload on Site, load Site
          this.loadingInitialData = true
          return loadSite({ id: params.siteId, isPublic })
        }
      } else if (type === 'commuter') {
        // no public views for this, so don't allow it
        if (site && !params.commuterId) {
          return this.setState({ dataLoading: false })
        } else if ((!site || (params.commuterId && !commuter)) && !this.loadingInitialData) {
          this.loadingInitialData = true
          loadSite({ id: params.siteId })
          if (params.commuterId && !commuter) {
            loadCommuter({ id: params.commuterId })
          } else if (!params.commuterId) {
            // creating new commuter, say data is loaded because breadcrumb will update on its own
            this.setState({ dataLoading: false })
          }
          return
        }
      }

      this.loadingInitialData = false
      this.loadingInitialData2 = false

      if (type.indexOf('site') > -1 && type.indexOf('only') === -1) {
        /***************************************************************
         determine if commuters should be loaded
        ***************************************************************/
        let shouldLoadCommuters = false

        const allCommutersLoadedFromAllSites = () => {
          const numCommutersInSites = sites.reduce((accumulator, currentSite) => {
            return accumulator + currentSite.commuters.length
          }, 0)
          return numCommutersInSites === commuters.length
        }

        // check if all commuters have been loaded
        if ((!isMultiSite && site && (site.commuters.length > commuters.length)) ||
          (isMultiSite && !allCommutersLoadedFromAllSites())) {
          // not all commuters loaded in store
          shouldLoadCommuters = true
        } else {
          // check if all commuters have been geocoded and have stats calculated
          for (let i = 0; i < commuters.length; i++) {
            const curCommuter = commuters[i]
            const isGeocoded = curCommuter.geocodeConfidence !== -1
            const hasStats = curCommuter.modeStats
            if (!isGeocoded || !hasStats) {
              shouldLoadCommuters = true
              break
            }
          }
        }

        if (shouldLoadCommuters && !this.loadCommutersTimeout) {
          // load commuters if not already doing so
          let loadCommutersQuery
          if (isMultiSite) {
            // query for commuters at all siteIds
            loadCommutersQuery = {
              siteId: {
                $in: multiSite.sites
              },
              requester: {
                entity: 'multi-site',
                id: params.multiSiteId
              }
            }
          } else {
            // load commuters only from specific site
            loadCommutersQuery = {
              requester: {
                entity: 'site',
                id: params.siteId
              },
              siteId: site._id
            }
          }
          this.loadCommutersTimeout = setTimeout(() => {
            this.loadCommutersTimeout = undefined
            loadCommuters({ isPublic, queryParams: loadCommutersQuery })
            this.setState({ loadingCommuters: true })
          }, 1111)
        } else if (!shouldLoadCommuters) {
          this.setState({ loadingCommuters: false })
          if (this.loadCommutersTimeout) {
            clearTimeout(this.loadCommutersTimeout)
          }
        }

        /***************************************************************
         determine if site should be loaded
        ***************************************************************/
        if (site &&
          site.calculationStatus === 'calculating') {
          // should load site
          if (!this.loadSiteTimeout) {
            this.loadSiteTimeout = setTimeout(() => {
              this.loadSiteTimeout = undefined
              loadSite({ id: site._id, isPublic })
            }, 1111)
          }
        } else {
          // site doens't need to load
          if (this.loadSiteTimeout) {
            clearTimeout(this.loadSiteTimeout)
          }
        }

        /***************************************************************
         determine if polygons should be loaded
        ***************************************************************/
        if (polygonStore) {
          const shouldLoadPolygons = (site &&
            site.calculationStatus === 'successfully' &&
            !entityMapToEntityArray(polygonStore)
              .some((isochrone) => isochrone.siteId === site._id))

          if (shouldLoadPolygons && !this.loadingPolygons) {
            // if 0 polygons exist for site, assume they need to be fetched
            loadPolygons({
              isPublic,
              queryParams: { 
                requester: {
                  entity: 'site',
                  id: site._id
                },
                siteId: site._id
              }
            })
            this.loadingPolygons = true
          } else {
            this.loadingPolygons = false
          }
        }
      }

      this.setState({ dataLoading: false })
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
