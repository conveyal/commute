import {makeGenericReducerHandlers} from '../utils/reducers'

export const reducers = makeGenericReducerHandlers({
  handlers: ['set many', 'delete many'],
  name: {
    singular: 'polygon',
    plural: 'polygons'
  }
})

export const initialState = {}
