import {
  getGenericReducerInitialState,
  makeGenericReducerHandlers
} from '../utils/reducers'

export const reducers = makeGenericReducerHandlers({
  handlers: ['add', 'add many', 'delete', 'set', 'set many'],
  name: {
    singular: 'multi-site',
    plural: 'multi-sites'
  }
})

export const initialState = getGenericReducerInitialState()
