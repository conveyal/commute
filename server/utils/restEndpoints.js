const each = require('async/each')
const pick = require('lodash.pick')

function makeFindQuery (req, query) {
  return Object.assign(query, { trashed: undefined, user: req.user.sub })
}

function makeGenericModelResponseFn (res) {
  return (err, data) => {
    res.set('Content-Type', 'application/json')
    if (err) return serverError(res, err)
    res.json(data)
  }
}

function makeGetModelResponseFn (childModels, res, isCollection, returnChildrenAsEntities) {
  const genericResponder = makeGenericModelResponseFn(res)
  return (err, data) => {
    if (err) return genericResponder(err)
    if (!Array.isArray(data)) {
      data = [data]
    }

    if (!childModels) return genericResponder(err, isCollection ? data : data[0])

    // wow, awesome, with normalized mongoose models I get to make extra queries
    // to the db to do joins!  </sarcasm>
    const outputData = []
    each(data, (entity, entityCb) => {
      const curEntity = Object.assign({}, entity._doc)
      each(childModels, (childModel, childCb) => {
        childModel.model.find({
          [childModel.foreignKey]: curEntity._id,
          trashed: undefined,
          user: curEntity.user
        }, (err, childEntities) => {
          if (err) return childCb(err)
          if (returnChildrenAsEntities || childModel.returnChildrenAsEntities) {
            curEntity[childModel.key] = childEntities
          } else {
            curEntity[childModel.key] = childEntities.map((childEntity) => childEntity._id)
          }
          childCb()
        })
      }, (err) => {
        if (err) return entityCb(err)
        outputData.push(curEntity)
        entityCb()
      })
    }, (err) => {
      genericResponder(err, isCollection ? outputData : outputData[0])
    })
  }
}

function serverError (res, err) {
  console.error(err)
  res.status(500).json({error: err})
}

/**
 * Make a rest endpoint with the specified routes
 *
 * @param  {Object} app         The express app
 * @param  {Object} jwt         The jwt middleware if it should be used
 * @param  {Object} cfg         Configuration object with the following keys:
 * - {Object} commands    Keys representing commands to make and their corresponding options
 * - {String} name        The endpoint name
 * - {Object} model       The mongo model to use
 * - {Bool} returnChildrenAsEntities  If true, returns children as entities, otherwise returns list of IDs
 * - {Array} childModels  An optional array of object cfgs describing child relationships
 *   Has the following keys
 *   - {String} foreignKey     Foreign key field name in child model
 *   - {String} key            Children field to add in the paret data output
 *   - {Object} model          Child model
 */
module.exports = function makeRestEndpoints (app, jwt, cfg) {
  const commands = cfg.commands
  const model = cfg.model
  const modelFields = Object.keys(model.schema.paths)
  const name = cfg.name
  const returnChildrenAsEntities = cfg.returnChildrenAsEntities
  if (commands['Collection DELETE']) {
    app.delete(`/api/${name}`, jwt, (req, res) => {
      // TODO: security concern: findQuery uses any parsed json, allowing any kind of mongoose query
      const removeQuery = makeFindQuery(req, pick(req.query, modelFields))
      model.remove(removeQuery, makeGetModelResponseFn(cfg.childModels, res, true, returnChildrenAsEntities))
    })
  }

  if (commands['Collection GET']) {
    app.get(`/api/${name}`, jwt, (req, res) => {
      // TODO: security concern: findQuery uses any parsed json, allowing any kind of mongoose query
      const findQuery = makeFindQuery(req, pick(req.query, modelFields))
      model.find(findQuery, makeGetModelResponseFn(cfg.childModels, res, true, returnChildrenAsEntities))
    })
  }

  if (commands['Collection POST']) {
    app.post(`/api/${name}`, jwt, (req, res) => {
      res.set('Content-Type', 'application/json')
      if (!Array.isArray(req.body)) return serverError(res, 'Invalid input data.  Expected an array.')
      const inputData = req.body.map((entity) => Object.assign({ user: req.user.sub }, entity))
      model.create(inputData, makeGetModelResponseFn(cfg.childModels, res, true, returnChildrenAsEntities))
    })
  }

  if (commands['DELETE']) {
    app.delete(`/api/${name}/:id`, jwt, (req, res) => {
      // don't use findByIdAndUpdate because it doesn't trigger pre('save') hook
      model.findOne(makeFindQuery(req, { _id: req.params.id }), (err, doc) => {
        if (err) return serverError(res, err)
        const modelResponder = makeGenericModelResponseFn(res)
        if (!doc) return serverError(res, 'a database error occurred: record not found')
        doc.trash((err) => {
          modelResponder(err, doc)
        })
      })
    })
  }

  if (commands['GET']) {
    app.get(`/api/${name}/:id`, jwt, (req, res) => {
      model.findOne(makeFindQuery(req, { _id: req.params.id }),
        makeGetModelResponseFn(cfg.childModels, res, false, returnChildrenAsEntities))
    })
  }

  if (commands['PUT']) {
    app.put(`/api/${name}/:id`, jwt, (req, res) => {
      // don't use findByIdAndUpdate because it doesn't trigger pre('save') hook
      model.findOne(makeFindQuery(req, { _id: req.params.id }), (err, doc) => {
        if (err) return serverError(res, err)
        if (!doc) return serverError(res, 'a database error occurred: record not found')
        doc.set(req.body)
        doc.save(makeGetModelResponseFn(cfg.childModels, res, false, returnChildrenAsEntities))
      })
    })
  }
}
