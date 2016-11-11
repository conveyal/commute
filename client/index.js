
import mount from '@conveyal/woonerf/build/lib/mount'
import createStore from '@conveyal/woonerf/build/lib/store'

import reducers from './reducers'
import router from './router'

mount({
  id: 'root',
  router,
  store: createStore(reducers)
})
