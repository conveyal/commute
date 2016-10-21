/* global describe, expect, it */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'

import Icon from '../../../client/components/icon'

describe('Container > Icon', () => {
  it('renders correctly', () => {
    const props = {
      type: 'pencil',
      className: 'test'
    }
    // mount component
    const tree = mount(
      <Icon
        {...props}
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})
