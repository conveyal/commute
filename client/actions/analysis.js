import {createAction} from 'redux-actions'
import {findMatches} from 'ridematcher'

import makeGenericModelActions from '../utils/actions'

const actions = makeGenericModelActions({
  commands: {
    'Collection GET': {},
    'Collection POST': {},
    'DELETE': {},
    'GET': {}
  },
  parentKey: 'organizationId',
  parentName: 'organization',
  pluralName: 'analyses',
  singularName: 'analysis'
})

// helper to initiate calculation of ridematches
const setRidematches = createAction('set ridematches')

actions.calculateRideshares = ({analysis, commuterStore, group, site}) => {
  // prepare data for calculation
  const siteCoords = [site.coordinate.lon, site.coordinate.lat]
  const commuters = []

  group.commuters.forEach((commuterId) => {
    const commuter = commuterStore[commuterId]
    commuters.push({
      _id: commuterId,
      from: [commuter.coordinate.lon, commuter.coordinate.lat],
      to: siteCoords
    })
  })

  // calculate Rideshares
  return findMatches(commuters, {
    radius: site.radius,
    units: 'miles'
  }).then((ridematches) => {
    console.log('ridematches calculated')
    return setRidematches({ analysis, ridematches })
  }).catch((err) => {
    console.error('error calculating ridematches', err)
  })
}

export default actions
