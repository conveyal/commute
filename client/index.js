
import mount from '@conveyal/woonerf/mount'

import reducers from './reducers'
import router from './router'

mount({
  app: router,
  id: 'root',
  reducers
})
