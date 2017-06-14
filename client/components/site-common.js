import { formatPercent, formatPercentAsStr } from '../utils'
import {toCoordinates} from '@conveyal/lonlat'
import distance from '@turf/distance'
import humanizeDuration from 'humanize-duration'

export function processSite (commuters, analysisMode) {
  const pctGeocoded = formatPercent(commuters.reduce((accumulator, commuter) => {
    return accumulator + (commuter.geocodeConfidence !== -1 ? 1 : 0)
  }, 0) / commuters.length)
  const pctStatsCalculated = formatPercent(commuters.reduce((accumulator, commuter) => {
    return accumulator + (commuter.modeStats ? 1 : 0)
  }, 0) / commuters.length)
  const allCommutersGeocoded = pctGeocoded === 100
  const allCommutersStatsCalculated = pctStatsCalculated === 100

  // compute summary stats for bike/transit
  const summaryStats = {}

  if (allCommutersStatsCalculated) {
    let numWith60MinTransit = 0
    summaryStats.numWith20MinWalk = 0
    let numWith30MinBike = 0
    commuters.forEach((commuter) => {
      if (commuter.modeStats.TRANSIT.travelTime > -1 &&
        commuter.modeStats.TRANSIT.travelTime <= 3600) {
        numWith60MinTransit++
      }

      if (commuter.modeStats.BICYCLE.travelTime > -1 &&
        commuter.modeStats.BICYCLE.travelTime <= 1800) {
        numWith30MinBike++
      }
    })

    summaryStats.pctWith60MinTransit = formatPercentAsStr(numWith60MinTransit / commuters.length)
    summaryStats.pctWith30MinBike = formatPercentAsStr(numWith30MinBike / commuters.length)
  }

  // analysis mode stats

  const analysisModeStatsLookup = {}

  commuters.forEach((commuter) => {
    let travelTime
    if (commuter.modeStats) {
      travelTime = commuter.modeStats[analysisMode].travelTime
    } else {
      travelTime = 'calculating...'
    }
    // skip uncreachables
    if (travelTime === -1) {
      return
    }
    if (!analysisModeStatsLookup[travelTime]) {
      analysisModeStatsLookup[travelTime] = 0
    }
    analysisModeStatsLookup[travelTime]++
  })

  let cumulative = 0
  const analysisModeStats = Object.keys(analysisModeStatsLookup)
    .sort((a, b) => a - b)
    .map((range) => {
      const minutes = range / 60
      const num = analysisModeStatsLookup[range]
      cumulative += num
      return {
        bin: (range === 'calculating...'
          ? range
          : `< ${humanizeDuration(minutes * 60 * 1000)}`
        ),
        num,
        cumulative,
        cumulativePct: cumulative / commuters.length
      }
    })

  // rideshare stats

  // only do this if all commuters are geocoded
  const ridematches = {}
  const ridematchingAggregateTable = []

  const addRidematch = (commuterA, commuterB, distance) => {
    if (!ridematches[commuterA._id]) {
      ridematches[commuterA._id] = {
        commuter: commuterA,
        matches: [],
        minDistance: distance
      }
    }
    ridematches[commuterA._id].matches.push({
      commuter: commuterB,
      distance
    })
    if (ridematches[commuterA._id].minDistance > distance) {
      ridematches[commuterA._id].minDistance = distance
    }
  }

  if (allCommutersGeocoded) {
    for (let i = 0; i < commuters.length; i++) {
      const commuterA = commuters[i]
      const commuterAcoordinates = toCoordinates(commuterA.coordinate)
      for (let j = i + 1; j < commuters.length; j++) {
        const commuterB = commuters[j]
        const commuterBcoordinates = toCoordinates(commuterB.coordinate)
        const distanceBetweenCommuters = distance(commuterAcoordinates, commuterBcoordinates, 'miles')
        if (distanceBetweenCommuters <= 5) {
          addRidematch(commuterA, commuterB, distanceBetweenCommuters)
          addRidematch(commuterB, commuterA, distanceBetweenCommuters)
        }
      }
    }

    const ridematchingBinsByMaxDistance = [0.25, 0.5, 1, 2, 5]
    const ridematchingBinLabels = [
      '< 1/4 mile',
      '< 1/2 mile',
      '< 1 mile',
      '< 2 miles',
      '< 5 miles',
      '5 miles+'
    ]
    const ridematchingBinVals = [0, 0, 0, 0, 0, 0]

    // tally up how many are in each bin
    commuters.forEach((commuter) => {
      const match = ridematches[commuter._id]
      if (match) {
        let binIdx = 0
        while (binIdx < ridematchingBinsByMaxDistance.length &&
          match.minDistance > ridematchingBinsByMaxDistance[binIdx]) {
          binIdx++
        }
        ridematchingBinVals[binIdx]++
      } else {
        ridematchingBinVals[ridematchingBinVals.length - 1]++
      }
    })

    let cumulativeNum = 0
    ridematchingBinLabels.forEach((label, idx) => {
      const numInBin = ridematchingBinVals[idx]
      ridematchingAggregateTable.push({
        bin: label,
        cumulative: cumulativeNum + numInBin,
        cumulativePct: (cumulativeNum + numInBin) / commuters.length,
        num: numInBin
      })

      cumulativeNum += numInBin
    })

    const upToOneMileBinIdx = 2
    summaryStats.pctWithRidematch = formatPercentAsStr(ridematchingAggregateTable[upToOneMileBinIdx].cumulativePct)
  }

  return {
    pctGeocoded,
    pctStatsCalculated,
    allCommutersGeocoded,
    allCommutersStatsCalculated,
    summaryStats,
    ridematchingAggregateTable,
    ridematches,
    analysisModeStats
  }
}

export function downloadMatches (ridematches) {
  let csvContent = 'data:text/csv;charset=utf-8,'
  csvContent += 'c1_name,c1_addr,c1_confidence,c2_name,c2_addr,c2_confidence,distance\n'

  const matchKeys = Object.keys(ridematches)
  if (matchKeys.length > 0) {
    matchKeys.forEach(key => {
      const ridematch = ridematches[key]
      if (ridematch.matches.length > 0) {
        ridematch.matches.forEach(m => {
          const row = []
          row.push(ridematch.commuter.name)
          row.push(`"${ridematch.commuter.address}"`)
          row.push(ridematch.commuter.geocodeConfidence)
          row.push(m.commuter.name)
          row.push(`"${m.commuter.address}"`)
          row.push(m.commuter.geocodeConfidence)
          row.push(m.distance)

          const rowText = row.join(',')
          csvContent += rowText + '\n'
        })
      }
    })
  }

  var encodedUri = encodeURI(csvContent)
  var link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', 'matches.csv')
  document.body.appendChild(link) // Required for FF
  link.click()
}
