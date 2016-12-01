/* global describe, expect, it */

import {mount} from 'enzyme'
import pretty from 'pretty'
import React from 'react'
import {Button} from 'react-bootstrap'
import {Provider} from 'react-redux'

import {makeGenericModelActionsExpectations} from '../../test-utils/actions'
import {makeMockStore, mockStores} from '../../test-utils/mock-data'

import Organizations from '../../../client/containers/organizations'

/* TODO: test delete agency
const agencyExpectations = makeGenericModelActionsExpectations({
  pluralName: 'agencies',
  singularName: 'agency'
}) */
const organizationExpectations = makeGenericModelActionsExpectations({
  pluralName: 'organizations',
  singularName: 'organization'
})

describe('Container > Organizations', () => {
  it('Organizations View loads', () => {
    // mount component
    const tree = mount(
      <Provider store={makeMockStore(mockStores.withBlankAgency)}>
        <Organizations
          params={{agencyId: 'agency-1'}}
          />
      </Provider>
    )
    expect(pretty(tree.find(Organizations).html())).toMatchSnapshot()
  })

  it('Organizations View loads with one organization', () => {
    // mount component
    const tree = mount(
      <Provider store={makeMockStore(mockStores.withBlankOrganization)}>
        <Organizations
          params={{agencyId: 'agency-3'}}
          />
      </Provider>
    )
    expect(pretty(tree.find(Organizations).html())).toMatchSnapshot()
  })

  it('Delete Organization', () => {
    const mockStore = makeMockStore(mockStores.withBlankOrganization)
    window.confirm = () => true

    // Given a logged-in user is viewing the organizations view
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <Organizations
          params={{agencyId: 'agency-3'}}
          />
      </Provider>
    )

    // When the user clicks the delete button for an existing organization
    // And the user confirms the Confirm Deletion dialog
    const deleteButton = tree.find('table').find(Button).last()
    deleteButton.simulate('click')

    organizationExpectations.expectDeleteAction({
      action: mockStore.getActions()[1],
      entity: {
        _id: 'organization-1',
        agencyId: 'agency-3',
        email: 'My new value',
        name: 'Mock Organization'
      }
    })
  })
})
