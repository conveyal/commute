/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeGenericModelActionsExpectations} from '../../test-utils/actions'
import {timeoutPromise} from '../../test-utils/common'
import {makeMockStore, mockGroup, mockSite, mockStores} from '../../test-utils/mock-data.js'

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

  it('Create analysis', async () => {
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

    // When the user fills out all of the required fields (Name, Site, commuter group)
    // Name
    tree.find('input').first().simulate('change', {target: {value: 'My new analysis'}})

    // site
    tree.find('DropdownList').first().props().onChange(mockSite)

    // group
    tree.find('DropdownList').last().props().onChange(mockGroup)

    // And the user submits the form
    tree.find('button').last().simulate('click')

    // react-formal submit is asyncrhonous, so wait a bit
    await timeoutPromise(1000)

    analysisExpectations.expectCreateAction({
      action: mockStore.getActions()[0],
      newEntity: {
        groupId: 'group-2',
        name: 'My new analysis',
        organizationId: 'organization-2',
        numCommuters: 1,
        siteId: 'site-2'
      }
    })
  })
})
