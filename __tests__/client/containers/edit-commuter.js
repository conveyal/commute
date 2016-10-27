/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from '../../test-utils/mock-data.js'

import EditCommuter from '../../../client/containers/edit-commuter'

const mockStore = makeMockStore(mockStores.init)

describe('Container > EditCommuter', () => {
  it('Create/Edit Commuter View loads (create or edit mode)', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditCommuter />
      </Provider>
    )
    expect(mountToJson(tree.find(EditCommuter))).toMatchSnapshot()
  })

  it('Create/Edit Commuter View loads in edit mode', () => {
    throw new Error('unimplemented')
  })

  it('Create/Edit commuter', () => {
    throw new Error('unimplemented')
  })

  it('Delete commuter', () => {
    throw new Error('unimplemented')
  })

  it('Navigate back to Commuter Group View', () => {
    throw new Error('unimplemented')
  })
})
