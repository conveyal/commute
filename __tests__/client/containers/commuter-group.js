/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import pretty from 'pretty'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from '../../test-utils/mock-data.js'
import '../../test-utils/mock-leaflet'

import CommuterGroup from '../../../client/containers/commuter-group'

describe('Container > CommuterGroup', () => {
  it('Commuter Group View loads', () => {
    const mockStore = makeMockStore(mockStores.complexOrganization)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <CommuterGroup
          params={{organizationId: '2', groupId: '1'}}
          />
      </Provider>
      , {
        attachTo: document.getElementById('test')
      }
    )

    expect(mountToJson(tree.find('.group-content'))).toMatchSnapshot()

    // cluster should be added initially
    expect(pretty(tree.find('.react-leaflet-cluster-layer').html())).toMatchSnapshot()
  })

  /* it('Edit commuter group name', () => {
    throw new Error('unimplemented')
  })

  it('Delete Commuter', () => {
    throw new Error('unimplemented')
  })

  it('Show Commuter in Ridematch', () => {
    throw new Error('unimplemented')
  }) */
})
