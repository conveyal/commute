export function commuterCalcsComplete (commuters) {
  for (let i = 0; i < commuters.length; i++) {
    const curCommuter = commuters[i]
    const isGeocoded = curCommuter.geocodeConfidence !== -1
    const hasStats = curCommuter.modeStats
    if (!isGeocoded || !hasStats) {
      return false
    }
  }
  return true
}

export function loadCommuters ({
  component,
  props,
  queryParams,
  shouldLoadCommuters
}) {
  const {loadCommuters: loadCommutersAction, router} = props
  const isPublic = router.location.pathname.indexOf('/public') === 0
  if (shouldLoadCommuters && !component.loadCommutersTimeout) {
    // load commuters if not already doing so
    component.loadCommutersTimeout = setTimeout(() => {
      component.loadCommutersTimeout = undefined
      loadCommutersAction({ isPublic, queryParams })
    }, 1111)
  } else if (!shouldLoadCommuters) {
    if (component.loadCommutersTimeout) {
      clearTimeout(component.loadCommutersTimeout)
    }
  }
}
