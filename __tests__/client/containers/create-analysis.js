/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeGenericModelActionsExpectations} from '../../test-utils/actions'
import {makeMockStore, mockStores} from '../../test-utils/mock-data.js'

import CreateAnalysis from '../../../client/containers/create-analysis'

const analysisExpectations = makeGenericModelActionsExpectations({
  pluralName: 'analyses',
  singularName: 'analysis'
})

describe('Container > CreateAnalysis', () => {
  it('Create Analysis View loads', () => {
    const mockStore = makeMockStore(mockStores.withAnalysisRun)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <CreateAnalysis
          params={{organizationId: 'organization-2'}}
          />
      </Provider>
    )
    expect(mountToJson(tree.find(CreateAnalysis))).toMatchSnapshot()
  })

  it('Create analysis', () => {
    // Given a logged-in user is viewing the Create Analysis View
    mockStores.withAnalysisRun.analysis = {}
    const mockStore = makeMockStore(mockStores.withAnalysisRun)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <CreateAnalysis
          params={{organizationId: 'organization-2'}}
          />
      </Provider>
    )

    // When the user fills out all of the required fields (Site, commuter group)
    // site
    tree.find('Select').first().props().onChange({ value: 'site-2' })
    // group
    tree.find('Select').last().props().onChange({ value: 'group-2' })

    // And the user submits the form
    tree.find('button').last().simulate('click')

    analysisExpectations.expectCreateAction({
      action: mockStore.getActions()[0],
      newEntity: {
        groupId: 'group-2',
        organizationId: 'organization-2',
        siteId: 'site-2'
      }
    })
  })
})
