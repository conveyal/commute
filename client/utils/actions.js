/* globals alert */

import fetchAction from '@conveyal/woonerf/fetch'
import debounce from 'debounce'
import qs from 'qs'
import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'

import {network} from '../utils/messages'

/**
 * Handle fetching errors.  Redirect to login if any response is a 401.
 *
 * @param  {String} alertMsg  The message to display in an alert
 * @param  {Mixed} err        the error from woonerf fetchAction
 * @param  {Mixed} res        the res from woonerf fetchAction
 * @return {Mixed}            return varies
 */
function fetchErrorHandler (alertMsg, err, res) {
  if (err.status === 401) {
    return push('/login')
  } else {
    debounce(() => {
      alert(alertMsg)
      // TODO: replace w/ modal?  alert halts js thread
      // so other failures will still get funnelled here
      // once execution resumes
    }, 5000, true)
  }
}

/**
 * Make generic model actions that communicate with a rest server
 *
 * @param  {Object} cfg An object with the following parameters:
 * - commands: An object with the keys being commands and the corresponding cfg of each command
 * -- redirectionStrategy: The redirection strategy to use upon success.
 *  Can be one of following: 'toEntity', 'toParent', 'toHome', undefined (no redirection)
 *  Defaults are as follows:
 *    Collection GET, GET: null
 *    Collection POST, PUT: toEntity
 *    DELETE: toParent
 * - parentKey: Key in model of parent's id
 *   (must be provided if using toParent redirection strategy)
 * - parentName: Name of app route to parent view
 *   (must be provided if using toParent redirection strategy)
 * - pluralName: Plural name of the model
 * - singularName: Singular name of the model
 * @return {Object}     The actions
 */
export default function makeGenericModelActions (cfg) {
  const {commands, parentKey, parentName, pluralName, singularName} = cfg
  const actions = {}

  // make local set actions
  const addLocally = createAction(`add ${singularName}`)
  const deleteLocally = createAction(`delete ${singularName}`)
  const setLocally = createAction(`set ${singularName}`)
  const setAllLocally = createAction(`set ${pluralName}`)

  const baseEndpoint = `/api/${singularName}`

  const redirectionStrategies = {
    'toEntity': (entity) => {
      return push(`/${singularName}/${entity._id}`)
    },
    'toHome': () => {
      return push('/')
    },
    'toParent': (entity) => {
      return push(`/${parentName}/${entity[parentKey]}`)
    }
  }

  /**
   * Do a redirect if needed
   *
   * @param  {Object} cfg Paremters as follows:
   *   - actions: The actions to append to
   *   - endpointCfg: The endpoint config
   *   - defaultStrategy: The default redire strategy to use (default: undefined)
   *   - redirectArgs: Arguments to provide to the redirectionStrategy
   */
  const doRedirectIfNecessary = (cfg) => {
    const redirectionStrategy = (cfg.endpointCfg.redirectionStrategy !== undefined
      ? cfg.endpointCfg.redirectionStrategy
      : cfg.defaultStrategy)

    if (redirectionStrategy) {
      const redirect = redirectionStrategies[redirectionStrategy](cfg.redirectArgs)
      if (redirect) {
        cfg.actions.push(redirect)
      }
    }
  }

  if (commands['Collection GET']) {
    actions.loadMany = (queryParams) => {
      // only include filteredKeys in querystring
      let queryString = ''
      if (queryParams) {
        queryString = qs.stringify(queryParams)
        if (queryString.length !== 0) {
          queryString = '?' + queryString
        }
      }

      // make request
      return fetchAction({
        next: (err, res) => {
          if (err) {
            return fetchErrorHandler(network.fetchingError, err, res)
          } else {
            return setAllLocally(res.value)
          }
        },
        url: baseEndpoint + queryString
      })
    }
  }

  if (commands['Collection POST']) {
    const endpointCfg = commands['Collection POST']
    actions.create = (newEntities) => {
      let body = newEntities
      if (!Array.isArray(body)) {
        body = [body]
      }
      return fetchAction({
        next: (err, res) => {
          if (err) {
            return fetchErrorHandler(network.savingError, err, res)
          } else {
            const createdEntities = res.value
            const actions = createdEntities.map((createdEntity) => addLocally(createdEntity))
            doRedirectIfNecessary({
              actions,
              endpointCfg,
              defaultStrategy: 'toEntity',
              redirectArgs: createdEntities[0]
            })
            return actions
          }
        },
        options: {
          body,
          method: 'POST'
        },
        url: baseEndpoint
      })
    }
  }

  if (commands['DELETE']) {
    const endpointCfg = commands['DELETE']
    actions.delete = (entity) => {
      return fetchAction({
        next: (err, res) => {
          if (err) {
            return fetchErrorHandler(network.savingError, err, res)
          } else {
            const actions = []
            doRedirectIfNecessary({
              actions,
              endpointCfg,
              defaultStrategy: 'toParent',
              redirectArgs: entity
            })
            actions.push(deleteLocally(entity))
            return actions
          }
        },
        options: {
          method: 'DELETE'
        },
        url: `${baseEndpoint}/${entity._id}`
      })
    }
  }

  if (commands['GET']) {
    actions.loadOne = (id) => fetchAction({
      next: (err, res) => {
        if (err) {
          return fetchErrorHandler(network.fetchingError, err, res)
        } else {
          return setLocally(res.value)
        }
      },
      url: `${baseEndpoint}/${id}`
    })
  }

  if (commands['PUT']) {
    const endpointCfg = commands['PUT']
    actions.update = (entity) => fetchAction({
      next: (err, res) => {
        if (err) {
          return fetchErrorHandler(network.savingError, err, res)
        } else {
          const updatedEntity = res.value
          const actions = [
            setLocally(updatedEntity)
          ]
          doRedirectIfNecessary({
            actions,
            endpointCfg,
            defaultStrategy: 'toEntity',
            redirectArgs: updatedEntity
          })
          return actions
        }
      },
      options: {
        body: entity,
        method: 'PUT'
      },
      url: `${baseEndpoint}/${entity._id}`
    })
  }

  return actions
}
