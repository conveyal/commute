import Auth0 from '@conveyal/woonerf/components/auth0-lock'
import React from 'react'

import messages from '../utils/messages'

export default function Login () {
  const lockOptions = {
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
  }
  return (
    <Auth0 lockOptions={lockOptions} />
  )
}
