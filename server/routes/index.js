const fs = require('fs')

import each from 'async/each'

const routes = {}
module.exports = routes

routes.makeRoutes = (app) => {
  fs.readdirSync(__dirname).forEach((file) => {
    if (file === 'index.js') return
    const name = file.substr(0, file.indexOf('.'))
    require('./' + name)(app)
  })
}

const makeGenericModelResponse = (res) => (err, data) => {
  res.set('Content-Type', 'application/json')
  if (err) return res.status(500).json({error: err})
  res.json(data)
}

const makeGetModelResponse = (childModels, res, isCollection) => (err, data) => {
  const genericResponder = makeGenericModelResponse(res)
  if (!childModels) return genericResponder(err, data)

  // wow, awesome, with normalized mongoose models I get to make extra queries
  // to the db to do joins!  </sarcasm>
  if (!Array.isArray(data)) {
    data = [data]
  }
  each(data, (entity, entityCb) => {
    each(childModels, (childModel, childCb) => {
      childModel.model.find({ [childModel.foreignKey]: entity._id }, (err, childEntities) => {
        if (err) return childCb(err)
        entity[childModel.key] = childEntities.map((childEntity) => childEntity._id)
        childCb()
      })
    }, entityCb)
  }, (err) => {
    genericResponder(err, isCollection ? data : data[0])
  })
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
routes.makeRestEndpoints = (app, cfg) => {
  const commands = cfg.commands
  const model = cfg.model
  const name = cfg.name
  if (commands['Collection GET']) {
    app.get(`/api/${name}`, (req, res) => {
      model.find(makeGetModelResponse(cfg.childModels, res, true))
    })
  }

  if (commands['Collection POST']) {
    app.post(`/api/${name}`, (req, res) => {
      res.set('Content-Type', 'application/json')
      model.create(req.body, makeGenericModelResponse(res))
    })
  }

  if (commands['DELETE']) {
    app.delete(`/api/${name}/:id`, (req, res) => {
      model.findByIdAndRemove(req.params.id, makeGenericModelResponse(res))
    })
  }

  if (commands['GET']) {
    app.get(`/api/${name}/:id`, (req, res) => {
      model.findById(req.params.id, makeGetModelResponse(cfg.childModels, res))
    })
  }

  if (commands['PUT']) {
    app.put(`/api/${name}/:id`, (req, res) => {
      model.findByIdAndUpdate(req.params.id, req.body, {new: true}, makeGenericModelResponse(res))
    })
  }
}
