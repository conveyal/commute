/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from '../../test-utils/mock-data.js'

import CreateSiteAnalysis from '../../../client/containers/create-site-analysis'

const mockStore = makeMockStore(mockStores.init)

describe('Container > CreateSiteAnalysis', () => {
  it('Create Analysis View loads', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <CreateSiteAnalysis />
      </Provider>
    )
    expect(mountToJson(tree.find(CreateSiteAnalysis))).toMatchSnapshot()
  })

  it('Create analysis', () => {
    throw new Error('unimplemented')
  })

  it('Navigate back to Organization View', () => {
    throw new Error('unimplemented')
  })
})
