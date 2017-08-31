import {getLock} from '@conveyal/woonerf/auth0'
import {Component, PropTypes} from 'react'

import messages from '../utils/messages'

export default class Login extends Component {
  static propTypes = {
    setAuth0User: PropTypes.func.isRequired
  }

  componentDidMount () {
    const {setAuth0User} = this.props
    const lock = getLock({
      allowSignUp: false,
      auth: {
        params: {
          scope: 'openid email user_metadata'
        },
        redirect: false
      },
      autoclose: true,
      closable: false,
      languageDictionary: {
        title: messages.authentication.logIn
      },
      redirectUrl: '/',
      theme: {
        logo: 'https://s3-eu-west-1.amazonaws.com/analyst-logos/conveyal-128x128.png',
        primaryColor: '#2389c9'
      }
    })
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
