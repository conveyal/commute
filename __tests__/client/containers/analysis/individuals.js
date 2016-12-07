/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import pretty from 'pretty'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from '../../../test-utils/mock-data.js'
import '../../../test-utils/mock-leaflet'

import {Individuals} from '../../../../client/containers/analysis'

const mockStore = makeMockStore(mockStores.withAnalysisRun)

describe('Container > Analysis > Individuals', () => {
  it('Individuals View loads (base case)', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <Individuals
          params={{analysisId: 'analysis-2'}}
          />
      </Provider>
      , {
        attachTo: document.getElementById('test')
      }
    )
    expect(mountToJson(tree.find('.individuals-header'))).toMatchSnapshot()
    expect(pretty(tree.find('.individuals-content').html())).toMatchSnapshot()
  })

  /* it('Select commuter', () => {
    // Given a logged-in user is viewing the Individual Commuter Analysis View
    // When the user selects a row of a commuter in the table
    // Then the CarFreeAtoZ map and sidebar should get updated with the commute possibilities for the selected commuter
  }) */
})
