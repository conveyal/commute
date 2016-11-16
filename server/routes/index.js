import fs from 'fs'

export const makeRoutes = (app) => {
  fs.readdirSync(__dirname).forEach((file) => {
    if (file === 'index.js') return
    const name = file.substr(0, file.indexOf('.'))
    require('./' + name)(app)
  })
}

const makeGenericModelResponse = (res) => (err, data) => {
  if (err) return res.status(500).json({error: err})
  res.json(data)
}

/**
 * Make a rest endpoint with the specified routes
 *
 * @param  {Object} app      The express app
 * @param  {String} name     The endpoint name
 * @param  {Object} commands Keys representing commands to make and their corresponding options
 * @param  {Object} model    The mongo model to use
 */
export const makeRestEndpoints = (app, name, commands, model) => {
  if (commands['Collection GET']) {
    app.get(`/api/${name}`, (req, res) => {
      model.find(makeGenericModelResponse(res))
    })
  }

  if (commands['Collection POST']) {
    app.post(`/api/${name}`, (req, res) => {
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
      model.findById(req.params.id, makeGenericModelResponse(res))
    })
  }

  if (commands['PUT']) {
    app.put(`/api/${name}/:id`, (req, res) => {
      model.findByIdAndUpdate(req.params.id, req.body, {new: true}, makeGenericModelResponse(res))
    })
  }
}
