const qs = require('qs')
const request = require('request')

const env = require('../utils/env').env

module.exports = function makeRoutes (app) {
  app.get('/api/otp-proxy', (req, res) => {
    res.set('Content-Type', 'application/json')
    const handleErr = (err) => res.status(500).json({error: err})
    const url = `${env.OTP_URL}/plan?${qs.stringify(req.query)}`
    console.log(url)
    request({
      json: true,
      url: `${env.OTP_URL}/plan`,
      qs: req.query
    }, (err, response, body) => {
      console.log('received response')
      if (err) return handleErr(err)
      console.log('response success')
      res.send(body)
    })
  })
}
