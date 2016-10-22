/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStoreData} from '../../test-utils/mock-store.js'

import CreateSiteAnalysis from '../../../client/containers/create-site-analysis'

const mockStore = makeMockStore(mockStoreData)

describe('Container > CreateSiteAnalysis', () => {
  it('renders correctly', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <CreateSiteAnalysis />
      </Provider>
    )
    expect(mountToJson(tree.find(CreateSiteAnalysis))).toMatchSnapshot()
  })
})
