import {makeGenericReducerHandlers} from '../utils/reducers'

export const reducers = makeGenericReducerHandlers({
  handlers: ['add', 'delete', 'set', 'set many'],
  name: {
    singular: 'multi-site',
    plural: 'multi-sites'
  }
})

export const initialState = {}
