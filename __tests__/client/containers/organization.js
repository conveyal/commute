/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {
  expectDeleteAnalysis,
  expectDeleteGroup,
  expectDeleteOrganization,
  expectDeleteSite
} from '../../test-utils/actions'
import {makeMockStore, mockStores} from '../../test-utils/mock-data.js'

import Organization from '../../../client/containers/organization'

describe('Container > Organization', () => {
  it('Organization View loads', () => {
    // mount component
    const tree = mount(
      <Provider store={makeMockStore(mockStores.complexOrganization)}>
        <Organization
          params={{organizationId: '2'}}
          />
      </Provider>
    )
    expect(mountToJson(tree.find(Organization))).toMatchSnapshot()
  })

  it('Delete Organization', () => {
    const mockStore = makeMockStore(mockStores.oneSimpleOrganization)
    window.confirm = () => true

    // Given a logged-in user is viewing the organization view
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <Organization
          params={{organizationId: '1'}}
          />
      </Provider>
    )

    // When the user clicks the delete button for an existing organization
    // And the user confirms the Confirm Deletion dialog
    const deleteButton = tree.find('.btn-group').first().find('button').last()
    deleteButton.simulate('click')

    expectDeleteOrganization(mockStore.getActions())
  })

  it('Delete Site', () => {
    const mockStore = makeMockStore(mockStores.complexOrganization)
    window.confirm = () => true

    // Given a logged-in user is viewing the organization view
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <Organization
          params={{organizationId: '2'}}
          />
      </Provider>
    )

    // When the user clicks the delete button for an existing site
    // And the user confirms the Confirm Deletion dialog
    const deleteButton = tree.find('table').at(1).find('button').last()
    deleteButton.simulate('click')

    expectDeleteSite(mockStore.getActions())
  })

  it('Delete Commuter Group', () => {
    const mockStore = makeMockStore(mockStores.complexOrganization)
    window.confirm = () => true

    // Given a logged-in user is viewing the organization view
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <Organization
          params={{organizationId: '2'}}
          />
      </Provider>
    )

    // When the user clicks the delete button for an existing commuter group
    // And the user confirms the Confirm Deletion dialog
    const deleteButton = tree.find('table').at(3).find('button').last()
    deleteButton.simulate('click')

    expectDeleteGroup(mockStore.getActions())
  })

  it('Delete Analysis', () => {
    const mockStore = makeMockStore(mockStores.complexOrganization)
    window.confirm = () => true

    // Given a logged-in user is viewing the organizations view
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <Organization
          params={{organizationId: '2'}}
          />
      </Provider>
    )

    // When the user clicks the delete button for an existing analysis
    // And the user confirms the Confirm Deletion dialog
    const deleteButton = tree.find('table').at(5).find('button').last()
    deleteButton.simulate('click')

    expectDeleteAnalysis(mockStore.getActions())
  })
})
