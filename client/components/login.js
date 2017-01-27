import Auth0 from '@conveyal/woonerf/components/auth0-lock'
import React from 'react'

import {messages} from '../utils/env'

export default function Login () {
  const lockOptions = {
    allowSignUp: false,
    theme: {
      logo: 'https://s3-eu-west-1.amazonaws.com/analyst-logos/conveyal-128x128.png',
      primaryColor: '#2389c9'
    },
    closable: true,
    autoclose: true,
    languageDictionary: {
      title: messages.authentication.logIn
    }
  }
  return (
    <Auth0 lockOptions={lockOptions} />
  )
}
