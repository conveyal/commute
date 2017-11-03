import {getLock} from '@conveyal/woonerf/auth0'
import {Component, PropTypes} from 'react'

import settings from '../../utils/settings'

export default class Login extends Component {
  static propTypes = {
    setAuth0User: PropTypes.func.isRequired
  }

  componentDidMount () {
    const {setAuth0User} = this.props
    const lock = getLock(settings.lock)
    lock.show()
    lock.on('authenticated', (authResult) => {
      lock.hide()
      lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          setAuth0User(null)
        } else {
          const user = {
            ...authResult,
            profile
          }
          window.localStorage.setItem('user', JSON.stringify(user))
          setAuth0User(user)
        }
      })
    })
  }

  render () {
    return null
  }
}
