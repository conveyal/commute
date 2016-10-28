/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from '../../test-utils/mock-data.js'

import AddCommuters from '../../../client/containers/add-commuters'

const mockStore = makeMockStore(mockStores.init)

describe('Container > AddCommuters', () => {
  it('Add Commuters View loads (base case)', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <AddCommuters />
      </Provider>
    )
    expect(mountToJson(tree.find(AddCommuters))).toMatchSnapshot()
  })

  /* it('Add Commuters View loads (from existing commuter group)', () => {
    throw new Error('unimplemented')
  })

  it('Create Commuter Group', () => {
    throw new Error('unimplemented')
  })

  it('Append Commuters to existing commuter group', () => {
    throw new Error('unimplemented')
  }) */
})
