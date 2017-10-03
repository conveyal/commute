
import mount from '@conveyal/woonerf/mount'

import {initialize} from './utils/analytics'
import reducers from './reducers'
import router from './router'

initialize()

mount({
  app: router,
  id: 'root',
  reducers
})
