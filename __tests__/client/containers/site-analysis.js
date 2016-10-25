/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from '../../test-utils/mock-data.js'

import SiteAnalysis from '../../../client/containers/site-analysis'

const mockStore = makeMockStore(mockStores.init)

describe('Container > SiteAnalysis', () => {
  it('renders correctly', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <SiteAnalysis />
      </Provider>
    )
    expect(mountToJson(tree.find(SiteAnalysis))).toMatchSnapshot()
  })
})
