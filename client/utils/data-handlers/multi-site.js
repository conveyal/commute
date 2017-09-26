import {commuterCalcsComplete, loadCommuters} from './util'

export function loadDataIfNeeded (props, component) {
  const {
    commuters,
    loadMultiSite,
    loadSites,
    multiSite,
    params,
    router,
    sites
  } = props

  const pathname = router.location.pathname
  const isPublic = pathname.indexOf('/public') === 0
  const isCreateOrEditPage = props.hasOwnProperty('editMode')

  if (!isCreateOrEditPage && params && params.multiSiteId) {
    // page that needs multiSite

    // check if multiSite is being loaded
    if (!multiSite && !component.loadingInitialData) {
      component.loadingInitialData = true
      if (params && params.multiSiteId) {
        loadMultiSite({id: params.multiSiteId, isPublic})
      }
      return
    } else if (
      multiSite &&
      sites &&
      multiSite.sites.length > sites.length &&
      !component.loadingInitialData2
    ) {
      component.loadingInitialData2 = true
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
  } else if (
    isCreateOrEditPage &&
    !component.loadingInitialData
  ) {
    // create or edit multi-site page
    let needsToLoadData = false
    if (params && params.multiSiteId && !multiSite) {
      needsToLoadData = true
      loadMultiSite({id: params.multiSiteId})
    }
    if (!component.initiatedSiteLoad) {
      needsToLoadData = true
      loadSites()
      component.initiatedSiteLoad = true
    }
    if (needsToLoadData) {
      component.loadingInitialData = true
      return
    }
  }

  component.loadingInitialData = false
  component.loadingInitialData2 = false

  // check if commuters from sites of multi-site should be loaded
  // the create-report and edit-multi-site pages don't need to load that data
  if (pathname.indexOf('/create') === -1 && pathname.indexOf('/edit') === -1) {
    let numCommutersInSites = 0
    let noSiteCalculationErrors = true
    sites.forEach(site => {
      if (site.calculationStatus === 'error') {
        noSiteCalculationErrors = false
      }
      numCommutersInSites += site.commuters.length
    })
    loadCommuters({
      component,
      props,
      queryParams: {
        siteId: {
          $in: multiSite.sites
        },
        requester: {
          entity: 'multi-site',
          id: params.multiSiteId
        }
      },
      shouldLoadCommuters: (
        noSiteCalculationErrors && (
          numCommutersInSites > commuters.length ||
          !commuterCalcsComplete(commuters)
        )
      )
    })
  }

  component.setState({ dataLoading: false })
}
