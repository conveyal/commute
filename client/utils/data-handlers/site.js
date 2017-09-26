import {entityMapToEntityArray} from '../entities'
import {commuterCalcsComplete, loadCommuters} from './util'

export function loadDataIfNeeded (props, component) {
  const {
    commuters,
    loadPolygons,
    loadSite,
    params,
    polygonStore,
    router,
    site
  } = props

  const pathname = router.location.pathname
  const isPublic = pathname.indexOf('/public') === 0

  if (!params || !params.siteId) {
    // creation page, no need to load
    return component.setState({ dataLoading: false })
  } else if (!site) {
    // pageload on Site, load Site
    if (!component.loadingInitialData) {
      component.loadingInitialData = true
      loadSite({ id: params.siteId, isPublic })
    }
    return
  }

  component.loadingInitialData = false

  // check if commuters of site should be loaded
  // the create-report and edit site pages don't need to load this data
  if (pathname.indexOf('create-report') === -1 && commuters) {
    /***************************************************************
     determine if commuters should be loaded
    ***************************************************************/
    if (site && site.calculationStatus !== 'error') {
      loadCommuters({
        component,
        props,
        queryParams: {
          requester: {
            entity: 'site',
            id: params.siteId
          },
          siteId: site._id
        },
        shouldLoadCommuters: (
          site.commuters.length > commuters.length ||
          !commuterCalcsComplete(commuters)
        )
      })
    }

    /***************************************************************
     determine if site's access is being calculated and thus should be reloaded
    ***************************************************************/
    if (site &&
      site.calculationStatus === 'calculating') {
      // should load site
      if (!component.loadSiteTimeout) {
        component.loadSiteTimeout = setTimeout(() => {
          component.loadSiteTimeout = undefined
          loadSite({ id: site._id, isPublic })
        }, 1111)
      }
    } else {
      // site doens't need to load
      if (component.loadSiteTimeout) {
        clearTimeout(component.loadSiteTimeout)
      }
    }

    /***************************************************************
     determine if polygons should be loaded
    ***************************************************************/
    const shouldLoadPolygons = (site &&
      site.calculationStatus === 'successfully' &&
      polygonStore &&
      !entityMapToEntityArray(polygonStore)
        .some((isochrone) => isochrone.siteId === site._id))

    if (shouldLoadPolygons && !component.loadingPolygons) {
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
      component.loadingPolygons = true
    } else {
      component.loadingPolygons = false
    }
  }

  component.setState({ dataLoading: false })
}

export function unmount (component) {
  if (component.loadSiteTimeout) {
    clearTimeout(component.loadSiteTimeout)
  }

  if (component.loadCommutersTimeout) {
    clearTimeout(component.loadCommutersTimeout)
  }

  component.loadingPolygons = false
}
