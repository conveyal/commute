/* global describe, expect, it */

import {mount} from 'enzyme'
import pretty from 'pretty'
import React from 'react'
import {Provider} from 'react-redux'

import {makeGenericModelActionsExpectations} from '../../test-utils/actions'
import {makeMockStore, mockStores} from '../../test-utils/mock-data.js'

import Organization from '../../../client/containers/organization'

const analysisExpectations = makeGenericModelActionsExpectations({
  pluralName: 'analyses',
  singularName: 'analysis'
})
const groupExpectations = makeGenericModelActionsExpectations({
  pluralName: 'groups',
  singularName: 'group'
})
const organizationExpectations = makeGenericModelActionsExpectations({
  pluralName: 'organizations',
  singularName: 'organization'
})
const siteExpectations = makeGenericModelActionsExpectations({
  pluralName: 'sites',
  singularName: 'site'
})

describe('Container > Organization', () => {
  it('Organization View loads', () => {
    // mount component
    const tree = mount(
      <Provider store={makeMockStore(mockStores.withAnalysisRun)}>
        <Organization
          params={{organizationId: 'organization-2'}}
          />
      </Provider>
    )
    expect(pretty(tree.find(Organization).html())).toMatchSnapshot()
  })

  it('Delete Organization', () => {
    const mockStore = makeMockStore(mockStores.withBlankOrganization)
    window.confirm = () => true

    // Given a logged-in user is viewing the organization view
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <Organization
          params={{organizationId: 'organization-1'}}
          />
      </Provider>
    )

    // When the user clicks the delete button for an existing organization
    // And the user confirms the Confirm Deletion dialog
    const deleteButton = tree.find('.btn-group').first().find('button').last()
    deleteButton.simulate('click')

    organizationExpectations.expectDeleteAction({
      action: mockStore.getActions()[0],
      entity: {
        _id: 'organization-1',
        agencyId: 'agency-3',
        name: 'Mock Organization'
      }
    })
  })

  it('Delete Site', () => {
    const mockStore = makeMockStore(mockStores.withAnalysisRun)
    window.confirm = () => true

    // Given a logged-in user is viewing the organization view
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <Organization
          params={{organizationId: 'organization-2'}}
          />
      </Provider>
    )

    // When the user clicks the delete button for an existing site
    // And the user confirms the Confirm Deletion dialog
    const deleteButton = tree.find('table').at(1).find('button').last()
    deleteButton.simulate('click')

    siteExpectations.expectDeleteAction({
      action: mockStore.getActions()[0],
      entity: {
        _id: 'site-2',
        name: 'Mock Site',
        organizationId: 'organization-2'
      }
    })
  })

  it('Delete Commuter Group', () => {
    const mockStore = makeMockStore(mockStores.withAnalysisRun)
    window.confirm = () => true

    // Given a logged-in user is viewing the organization view
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <Organization
          params={{organizationId: 'organization-2'}}
          />
      </Provider>
    )

    // When the user clicks the delete button for an existing commuter group
    // And the user confirms the Confirm Deletion dialog
    const deleteButton = tree.find('table').at(3).find('button').last()
    deleteButton.simulate('click')

    groupExpectations.expectDeleteAction({
      action: mockStore.getActions()[0],
      entity: {
        _id: 'group-2',
        name: 'Mock Group',
        organizationId: 'organization-2'
      }
    })
  })

  it('Delete Analysis', () => {
    const mockStore = makeMockStore(mockStores.withAnalysisRun)
    window.confirm = () => true

    // Given a logged-in user is viewing the organizations view
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <Organization
          params={{organizationId: 'organization-2'}}
          />
      </Provider>
    )

    // When the user clicks the delete button for an existing analysis
    // And the user confirms the Confirm Deletion dialog
    const deleteButton = tree.find('table').at(5).find('button').last()
    deleteButton.simulate('click')

    analysisExpectations.expectDeleteAction({
      action: mockStore.getActions()[0],
      entity: {
        _id: 'analysis-2',
        name: 'Mock Analysis',
        organizationId: 'organization-2'
      }
    })
  })
})
