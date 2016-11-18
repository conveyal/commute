/* global describe, expect, it */

import React from 'react'
import TestUtils from 'react-addons-test-utils'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from '../../test-utils/mock-data'

import Agencies from '../../../client/containers/agencies'

describe('Container > Agencies', () => {
  it('Agencies View loads', () => {
    // mount component
    const tree = TestUtils.renderIntoDocument(
      <Provider store={makeMockStore(mockStores.init)}>
        <Agencies />
      </Provider>
    )
    const agenciesNode = ReactDOM.findDOMNode(tree)

    console.log(agenciesNode)
  })

  /* it('Agencies View loads with one organization', () => {
    // mount component
    const tree = mount(
      <Provider store={makeMockStore(mockStores.oneSimpleOrganization)}>
        <Agencies />
      </Provider>
    )
    expect(mountToJson(tree.find(Agencies))).toMatchSnapshot()
  })

  it('Delete Organization', () => {
    const mockStore = makeMockStore(mockStores.oneSimpleOrganization)
    window.confirm = () => true

    // Given a logged-in user is viewing the agencies view
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <Agencies />
      </Provider>
    )

    // When the user clicks the delete button for an existing organization
    // And the user confirms the Confirm Deletion dialog
    const deleteButton = tree.find('table').find(Button).last()
    deleteButton.simulate('click')

    expectDeleteOrganization(mockStore.getActions())
  }) */
})
