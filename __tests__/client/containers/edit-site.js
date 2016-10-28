/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from '../../test-utils/mock-data.js'

import EditSite from '../../../client/containers/edit-site'

const mockStore = makeMockStore(mockStores.init)

describe('Container > EditSite', () => {
  it('Create/Edit Site View loads (create or edit mode)', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditSite />
      </Provider>
    )
    expect(mountToJson(tree.find(EditSite))).toMatchSnapshot()
  })

  /* it('Create/Edit Site View loads in edit mode', () => {
    throw new Error('unimplemented')
  })

  it('Create/Edit site', () => {
    throw new Error('unimplemented')
  })

  it('Delete Site', () => {
    throw new Error('unimplemented')
  }) */
})
