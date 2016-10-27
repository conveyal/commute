/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from '../../test-utils/mock-data.js'

import Analysis from '../../../client/containers/analysis'

const mockStore = makeMockStore(mockStores.init)

describe('Container > Analysis', () => {
  it('Analysis View loads (base case)', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <Analysis />
      </Provider>
    )
    expect(mountToJson(tree.find(Analysis))).toMatchSnapshot()
  })

  it('Analysis View loads (commuter group or site has changed)', () => {
    throw new Error('unimplemented')
  })

  it('Analysis View loads (analysis is being calculated)', () => {
    throw new Error('unimplemented')
  })

  it('Update Analysis', () => {
    throw new Error('unimplemented')
  })

  it('Delete analysis', () => {
    throw new Error('unimplemented')
  })
})
