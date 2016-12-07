import {makeGenericReducerHandlers} from '../utils/reducers'

export const reducers = makeGenericReducerHandlers({
  handlers: ['add', 'delete', 'set', 'set many'],
  name: {
    singular: 'site',
    plural: 'sites'
  }
})

export const initialState = {}
