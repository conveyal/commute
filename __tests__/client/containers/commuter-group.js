/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import pretty from 'pretty'
import React from 'react'
import {Provider} from 'react-redux'

import {makeGenericModelActionsExpectations} from '../../test-utils/actions'
import {makeMockStore, mockCommuter, mockStores} from '../../test-utils/mock-data.js'
import '../../test-utils/mock-leaflet'

import CommuterGroup from '../../../client/containers/commuter-group'

const commuterExpectations = makeGenericModelActionsExpectations({
  pluralName: 'commuters',
  singularName: 'commuter'
})

describe('Container > CommuterGroup', () => {
  it('Commuter Group View loads', () => {
    const mockStore = makeMockStore(mockStores.withAnalysisRun)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <CommuterGroup
          params={{groupId: 'group-2'}}
          />
      </Provider>
      , {
        attachTo: document.getElementById('test')
      }
    )

    expect(mountToJson(tree.find('.group-header'))).toMatchSnapshot()
    expect(pretty(tree.find('.group-content').html())).toMatchSnapshot()

    // TODO: cluster should be added initially
  })

  /* it('Edit commuter group name', () => {
    throw new Error('unimplemented')
  }) */

  it('Delete Commuter', () => {
    const mockStore = makeMockStore(mockStores.withAnalysisRun)
    window.confirm = () => true

    // Given a logged-in user is viewing the commuter group view
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <CommuterGroup
          params={{groupId: 'group-2'}}
          />
      </Provider>
      , {
        attachTo: document.getElementById('test')
      }
    )

    // clear all loading actions
    mockStore.clearActions()

    // When the user clicks the delete button for an existing site
    // And the user confirms the Confirm Deletion dialog
    const deleteButton = tree.find('table').at(1).find('button').last()
    deleteButton.simulate('click')

    commuterExpectations.expectDeleteAction({
      action: mockStore.getActions()[0],
      entity: mockCommuter
    })
  })

  /* it('Show Commuter in Ridematch', () => {
    throw new Error('unimplemented')
  }) */
})
