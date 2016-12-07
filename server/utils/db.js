const each = require('async/each')

export function makeCascadeDeleteModelsFn (foreignKey, models) {
  return function (next, done) {
    // CASCADE DELETE if needed
    if (this.isModified('trashed') && this.trashed) {
      const foreignKeyQuery = {}
      foreignKeyQuery[foreignKey] = this._id
      each(models, (model) => {
        model.find(foreignKeyQuery, (err, docs) => {
          if (err) return done(err)
          each(docs, (doc, cb) => {
            doc.trash(cb)
          }, done)
        })
      }, done)
    }
    next()
  }
}
