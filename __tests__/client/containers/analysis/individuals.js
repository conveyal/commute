/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from '../../../test-utils/mock-data.js'

import {Individuals} from '../../../../client/containers/analysis'

const mockStore = makeMockStore(mockStores.complexOrganization)

describe('Container > Analysis > Individuals', () => {
  it('Individuals View loads (base case)', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <Individuals
          params={{organizationId: '2', analysisId: '1'}}
          />
      </Provider>
    )
    expect(mountToJson(tree.find(Individuals))).toMatchSnapshot()
  })

  /* it('Select commuter', () => {
    // Given a logged-in user is viewing the Individual Commuter Analysis View
    // When the user selects a row of a commuter in the table
    // Then the CarFreeAtoZ map and sidebar should get updated with the commute possibilities for the selected commuter
  }) */
})
