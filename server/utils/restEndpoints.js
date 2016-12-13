const each = require('async/each')
const pick = require('lodash.pick')

function serverError (res, err) {
  console.error(err)
  res.status(500).json({error: err})
}

function makeGenericModelResponseFn (res) {
  return (err, data) => {
    res.set('Content-Type', 'application/json')
    if (err) return serverError(res, err)
    res.json(data)
  }
}

function makeGetModelResponseFn (childModels, res, isCollection) {
  return (err, data) => {
    const genericResponder = makeGenericModelResponseFn(res)
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
          trashed: undefined
        }, (err, childEntities) => {
          if (err) return childCb(err)
          curEntity[childModel.key] = childEntities.map((childEntity) => childEntity._id)
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

/**
 * Make a rest endpoint with the specified routes
 *
 * @param  {Object} app         The express app
 * @param  {Object} cfg         Configuration object with the following keys:
 * - {Object} commands    Keys representing commands to make and their corresponding options
 * - {String} name        The endpoint name
 * - {Object} model       The mongo model to use
 * - {Array} childModels  An optional array of object cfgs describing child relationships
 *   Has the following keys
 *   - {String} foreignKey     Foreign key field name in child model
 *   - {String} key            Children field to add in the paret data output
 *   - {Object} model          Child model
 */
module.exports = function makeRestEndpoints (app, cfg) {
  const commands = cfg.commands
  const model = cfg.model
  const modelFields = Object.keys(model.schema.paths)
  const name = cfg.name
  if (commands['Collection GET']) {
    app.get(`/api/${name}`, (req, res) => {
      const findQuery = Object.assign({ trashed: undefined }, pick(req.query, modelFields))
      model.find(findQuery, makeGetModelResponseFn(cfg.childModels, res, true))
    })
  }

  if (commands['Collection POST']) {
    app.post(`/api/${name}`, (req, res) => {
      res.set('Content-Type', 'application/json')
      model.create(req.body, makeGetModelResponseFn(cfg.childModels, res, true))
    })
  }

  if (commands['DELETE']) {
    app.delete(`/api/${name}/:id`, (req, res) => {
      // don't use findByIdAndUpdate because it doesn't trigger pre('save') hook
      model.findById(req.params.id, (err, doc) => {
        if (err) return serverError(res, err)
        doc.trash(makeGenericModelResponseFn(res))
      })
    })
  }

  if (commands['GET']) {
    app.get(`/api/${name}/:id`, (req, res) => {
      model.find({ _id: req.params.id, trashed: undefined }, makeGetModelResponseFn(cfg.childModels, res))
    })
  }

  if (commands['PUT']) {
    app.put(`/api/${name}/:id`, (req, res) => {
      // don't use findByIdAndUpdate because it doesn't trigger pre('save') hook
      model.findOne({ _id: req.params.id, trashed: undefined }, (err, doc) => {
        if (err) return serverError(res, err)
        doc.set(req.body)
        doc.save(makeGenericModelResponseFn(res))
      })
    })
  }
}
