/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from '../../../test-utils/mock-data.js'

import {Summary} from '../../../../client/containers/analysis'

const mockStore = makeMockStore(mockStores.withAnalysisRun)

describe('Container > Analysis > Summary', () => {
  it('Analysis Summary View loads (base case)', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <Summary
          params={{analysisId: 'analysis-2'}}
          />
      </Provider>
    )
    expect(mountToJson(tree.find(Summary))).toMatchSnapshot()
  })

  /* it('Analysis View loads (commuter group or site has changed)', () => {
    throw new Error('unimplemented')
  })

  it('Analysis View loads (analysis is being calculated)', () => {
    throw new Error('unimplemented')
  })

  it('Update Analysis', () => {
    throw new Error('unimplemented')
  })

  it('Delete analysis', () => {
    throw new Error('unimplemented')
  }) */
})
