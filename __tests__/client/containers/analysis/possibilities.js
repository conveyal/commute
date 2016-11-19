/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from '../../../test-utils/mock-data.js'

import {Possibilities} from '../../../../client/containers/analysis'

const mockStore = makeMockStore(mockStores.withAnalysisRun)

describe('Container > Analysis > Possibilities', () => {
  it('Analysis Possibilities View loads (base case)', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <Possibilities
          params={{analysisId: 'analysis-2'}}
          />
      </Provider>
    )
    expect(mountToJson(tree.find('.possibilities-header'))).toMatchSnapshot()
    expect(mountToJson(tree.find('.possibilities-legend-control'))).toMatchSnapshot()
    expect(mountToJson(tree.find('.table-bordered'))).toMatchSnapshot()
    /* expect(mountToJson(tree.find('.possibilities-settings'))).toMatchSnapshot() */ // problem with istanbul and snapshots
  })

  /* it('Slide maximum travel time', () => {
    // Given a logged-in user is viewing the Possibilities Analysis View
    // When the user slide the maximum travel time slider
    // Then the bar chart should recalculate given the new constraints
  })

  it('Slide maximum distance', () => {
    // Given a logged-in user is viewing the Possibilities Analysis View
    // When the user slide the maximum distance slider
    // Then the bar chart should recalculate given the new constraints
  })

  it('Slide maximum cost', () => {
    // Given a logged-in user is viewing the Possibilities Analysis View
    // When the user slide the maximum cost slider
    // Then the bar chart should recalculate given the new constraints
  })

  it('Slide maximum carpool radius', () => {
    // Given a logged-in user is viewing the Possibilities Analysis View
    // When the user slide the maximum carpool radius slider
    // Then the bar chart should recalculate given the new constraints
  }) */
})
