const createGrid = require('browsochrones').createGrid
const fetch = require('node-fetch')
const qs = require('qs')

const env = require('./server/utils/env').env

const query = {
  fromLat: 39.46614955717522,
  fromLon: -87.41134643554688,
  mode: 'WALK'
}

fetch(`${env.R5_URL}/grid?${qs.stringify(query)}`)
  .then(res => {
    console.log('parse as arrayBuffer')
    return res.arrayBuffer()
  })
  .then(data => {
    console.log('create grid')
    console.log(createGrid(data))
  })
  .catch((err) => {
    console.error(err)
  })
