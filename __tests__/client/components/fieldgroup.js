/* global describe, expect, it, jest */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'

import FieldGroup from '../../../client/components/fieldgroup'

describe('Container > FieldGroup', () => {
  it('renders correctly as input', () => {
    const props = {
      label: 'Name',
      name: 'name',
      onChange: jest.fn(),
      placeholder: 'Enter name',
      type: 'text'
    }
    // mount component
    const tree = mount(
      <FieldGroup
        {...props}
        />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})
