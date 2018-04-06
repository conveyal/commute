import Auth0Lock from 'auth0-lock'

export function getLock (options={}) {
  return new Auth0Lock(
    process.env.AUTH0_CLIENT_ID,
    process.env.AUTH0_DOMAIN,
    options
  )
}
