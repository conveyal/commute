const mongoose = require('mongoose')

mongoose.Promise = global.Promise // default is mpromise...ugh

let URI = process.env.MONGODB_URI

if (!URI) {
  const baseConnectionString = 'mongodb://localhost:27017/'
  let dbName = 'commute'
  if (process.env.NODE_ENV === 'test') {
    const uuid = require('uuid')
    dbName += uuid.v4()
  }
  URI = `${baseConnectionString}${dbName}`
}

const db = module.exports = mongoose.createConnection(URI)

function dropDbIfTesting (callback) {
  if (!callback) {
    callback = () => 'no-op'
  }
  if (process.env.NODE_ENV === 'test') {
    console.log('dropping test database ' + URI)
    db.dropDatabase(callback)
  } else {
    callback()
  }
}

db.on('connected', () => console.log('Mongoose default connection open to ' + URI))
db.on('error', (err) => console.log('Mongoose default connection error: ' + err))
db.on('disconnected', () => {
  console.log('Mongoose default connection disconnected')
  dropDbIfTesting()
})

// If the Node process ends, close the Mongoose connection
process.once('SIGINT', () => {
  dropDbIfTesting(() => {
    db.close(() => {
      console.log('Mongoose default connection disconnected through app termination')
      process.exit(0)
    })
  })
})

// For NODEMON
process.once('SIGUSR2', () => {
  dropDbIfTesting(() => {
    db.close(() => {
      console.log('Mongoose default connection disconnected through nodemon restart')
      process.kill(process.pid, 'SIGUSR2')
    })
  })
})
