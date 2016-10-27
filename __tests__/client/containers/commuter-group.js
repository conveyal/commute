/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from '../../test-utils/mock-data.js'

import CommuterGroup from '../../../client/containers/commuter-group'

const mockStore = makeMockStore(mockStores.init)

describe('Container > CommuterGroup', () => {
  it('Commuter Group View loads', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <CommuterGroup />
      </Provider>
    )
    expect(mountToJson(tree.find(CommuterGroup))).toMatchSnapshot()
  })

  it('Edit commuter group name', () => {
    throw new Error('unimplemented')
  })

  it('Add Single Commuter', () => {
    throw new Error('unimplemented')
  })

  it('Bulk Add Commuters', () => {
    throw new Error('unimplemented')
  })

  it('Edit Commuter', () => {
    throw new Error('unimplemented')
  })

  it('Delete Commuter', () => {
    throw new Error('unimplemented')
  })

  it('Show Commuter in Ridematch', () => {
    throw new Error('unimplemented')
  })
})
