const request = require('request')

const env = require('./server/utils/env').env

const requestCfg = {
  qs: {
    fromLat: 39.46614955717522,
    fromLon: -87.41134643554688,
    mode: 'WALK'
  },
  uri: `${env.R5_URL}/grid`
}

request(requestCfg, (err, res, data) => {
  // handle response
  if (err) {
    console.error('error calculating grid: ', err)
    return
  }

  console.log(Buffer.from(data).toString())
})
