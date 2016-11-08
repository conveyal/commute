/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from '../../../test-utils/mock-data.js'

import {TimeByMode} from '../../../../client/containers/analysis'

const mockStore = makeMockStore(mockStores.complexOrganization)

describe('Container > Analysis > TimeByMode', () => {
  it('Commute Time By Mode View loads (base case)', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <TimeByMode
          params={{organizationId: '2', analysisId: '1'}}
          />
      </Provider>
    )
    expect(mountToJson(tree.find(TimeByMode))).toMatchSnapshot()
  })

  /* it('Toggle mode checkbox', () => {
    // Given a logged-in user is viewing the Commute Time by Mode View
    // When the user toggles the checkbox to display a particular mode in the histogram
    // Then the histogram should redraw itself with the particular mode display state
  }) */
})
