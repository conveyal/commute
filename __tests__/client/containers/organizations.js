/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Button} from 'react-bootstrap'
import {Provider} from 'react-redux'

import {expectDeleteOrganization} from '../../test-utils/actions'
import {makeMockStore, mockStores} from '../../test-utils/mock-data'

import Organizations from '../../../client/containers/organizations'

describe('Container > Organizations', () => {
  it('Organizations View loads', () => {
    // mount component
    const tree = mount(
      <Provider store={makeMockStore(mockStores.init)}>
        <Organizations />
      </Provider>
    )
    expect(mountToJson(tree.find(Organizations))).toMatchSnapshot()
  })

  it('Organizations View loads with one organization', () => {
    // mount component
    const tree = mount(
      <Provider store={makeMockStore(mockStores.oneSimpleOrganization)}>
        <Organizations />
      </Provider>
    )
    expect(mountToJson(tree.find(Organizations))).toMatchSnapshot()
  })

  it('Delete Organization', () => {
    const mockStore = makeMockStore(mockStores.oneSimpleOrganization)
    window.confirm = () => true

    // Given a logged-in user is viewing the organizations view
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <Organizations />
      </Provider>
    )

    // When the user clicks the delete button for an existing organization
    // And the user confirms the Confirm Deletion dialog
    const deleteButton = tree.find('table').find(Button).last()
    deleteButton.simulate('click')

    expectDeleteOrganization(mockStore.getActions())
  })
})
