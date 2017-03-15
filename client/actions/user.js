import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'

const logoutMessage = createAction('log out')
export function logout () {
  window.localStorage.removeItem('user')
  return [
    logoutMessage(),
    push('/login')
  ]
}
