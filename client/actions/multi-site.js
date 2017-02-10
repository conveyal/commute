import update from 'react-addons-update'

import makeGenericModelActions from '../utils/actions'

const actions = makeGenericModelActions({
  commands: {
    'Collection GET': {},
    'Collection POST': {},
    'DELETE': {
      redirectionStrategy: 'toHome'
    },
    'GET': {},
    'PUT': {}
  },
  pluralName: 'multi-sites',
  singularName: 'multi-site'
})

actions.deleteSiteFromMultiSites = function ({multiSites, siteId}) {
  const actionsToDispatch = []
  multiSites.forEach((multiSite) => {
    const siteIdx = multiSite.sites.indexOf(siteId)
    if (siteIdx > -1) {
      // remove site from array
      const updatedMultiSite = update(multiSite, {
        sites: {
          $splice: [[siteIdx, 1]]
        }
      })

      // dispatch update action for multiSite
      actionsToDispatch.push(actions.update(updatedMultiSite, 'no-redirect'))
    }
  })

  return actionsToDispatch
}

export default actions
