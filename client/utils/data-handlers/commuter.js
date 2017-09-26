
export function loadDataIfNeeded (props, component) {
  const {commuter, loadCommuter, loadSite, params} = props

  // check to see if data needs to be loaded
  // for the create commuter page, the params will be empty, but the site needs to load
  // for the edit commuter page, we also need to load the commuter
  if (
    (!params || !params.commuterId || (params.commuterId && !commuter)) &&
    !component.loadingInitialData
  ) {
    // data needs to be loaded
    component.loadingInitialData = true
    loadSite({id: params.siteId})
    if (params.commuterId && !commuter) {
      // on edit commuter page and commuter hasn't loaded
      loadCommuter({id: params.commuterId})
    } else {
      // loading of the site on create page will not trigger a component update
      // therefore, say data has loaded
      component.setState({dataLoading: false})
    }
    return
  }
  component.loadingInitialData = false
  component.setState({dataLoading: false})
}
