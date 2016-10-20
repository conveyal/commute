
import mount from 'mastarm/react/mount'
import createStore from 'mastarm/react/store'

import reducers from './reducers'
import router from './router'

mount({
  id: 'root',
  router,
  store: createStore(reducers)
})
