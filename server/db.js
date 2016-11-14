const mongoose = require('mongoose')

mongoose.Promise = global.Promise // default is mpromise...ugh

const URI = process.env.MONGODB_URI || `mongodb://localhost/commute${process.env.test ? '-test' : ''}`
const db = module.exports = mongoose.createConnection(URI)

db.on('connected', () => console.log('Mongoose default connection open to ' + URI))
db.on('error', (err) => console.log('Mongoose default connection error: ' + err))
db.on('disconnected', () => console.log('Mongoose default connection disconnected'))

// If the Node process ends, close the Mongoose connection
process.once('SIGINT', () =>
  db.close(() =>
    console.log('Mongoose default connection disconnected through app termination') && process.exit(0)))

// For NODEMON
process.once('SIGUSR2', () =>
  db.close(() =>
    console.log('Mongoose default connection disconnected through nodemon restart') && process.kill(process.pid, 'SIGUSR2')))
