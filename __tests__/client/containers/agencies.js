/* global describe, expect, it */

import {mount} from 'enzyme'
import pretty from 'pretty'
import React from 'react'
import {Provider} from 'react-redux'

import {expectDeleteAction} from '../../test-utils/actions'
import {makeMockStore, mockStores} from '../../test-utils/mock-data'

import Agencies from '../../../client/containers/agencies'

describe('Container > Agencies', () => {
  it('Agencies View loads', () => {
    // mount component
    const tree = mount(
      <Provider store={makeMockStore(mockStores.init)}>
        <Agencies />
      </Provider>
    )
    expect(pretty(tree.find('Agencies').html())).toMatchSnapshot()
  })

  it('Agencies View loads with one agency', () => {
    // mount component
    const tree = mount(
      <Provider store={makeMockStore(mockStores.withBlankAgency)}>
        <Agencies />
      </Provider>
    )
    expect(pretty(tree.find('Agencies').html())).toMatchSnapshot()
  })

  it('Delete Agency', () => {
    const mockStore = makeMockStore(mockStores.withBlankAgency)
    window.confirm = () => true

    // Given a logged-in user is viewing the agencies view
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <Agencies />
      </Provider>
    )

    // clear load action
    mockStore.clearActions()

    // When the user clicks the delete button for an existing organization
    // And the user confirms the Confirm Deletion dialog
    const deleteButton = tree.find('table').find('Button').last()
    deleteButton.simulate('click')

    expectDeleteAction(mockStore.getActions())
  })
})
