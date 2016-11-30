import fetchAction from '@conveyal/woonerf/fetch'
import qs from 'qs'
import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'

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
const makeGenericModelActions = (cfg) => {
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
    actions.loadAll = (queryParams) => {
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
        next: (res, err) => {
          if (!err) {
            return setAllLocally(res.value)
          }
          // TODO handle error
        },
        url: baseEndpoint + queryString
      })
    }
  }

  if (commands['Collection POST']) {
    const endpointCfg = commands['Collection POST']
    actions.create = (newEntity) => {
      return fetchAction({
        next: (res, err) => {
          if (err) {
            // TODO handle error
          } else {
            const createdEntity = res.value
            const actions = [
              addLocally(createdEntity)
            ]
            doRedirectIfNecessary({
              actions,
              endpointCfg,
              defaultStrategy: 'toEntity',
              redirectArgs: createdEntity
            })
            return actions
          }
        },
        options: {
          body: newEntity,
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
        next: (res, err) => {
          if (err) {
            // TODO handle error
          } else {
            const actions = [
              deleteLocally(entity._id)
            ]
            doRedirectIfNecessary({
              actions,
              endpointCfg,
              defaultStrategy: 'toParent',
              redirectArgs: entity
            })
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
      next: (res, err) => {
        if (!err) {
          return setLocally(res.value)
        }
        // TODO handle error
      },
      url: `${baseEndpoint}/${id}`
    })
  }

  if (commands['PUT']) {
    const endpointCfg = commands['PUT']
    actions.update = (entity) => fetchAction({
      next: (res, err) => {
        if (err) {
          // TODO handle error
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

export default makeGenericModelActions
