import {toCoordinates} from '@conveyal/lonlat'
import humanizeDuration from 'humanize-duration'
import memoize from 'lodash.memoize'
import distance from '@turf/distance'

import {formatPercent, formatPercentAsStr} from '../utils'

/**
 * Get the most basic stats about a list of commuters
 *
 * @param {number} lastCommuterStoreUpdateTime  The last update time of the commuter store.
 *   Used for calculating the memoize key.
 * @param {string} entityId The id of the entity in question.
 *   Used for calculating the memoize key.
 * @param {Array} commuters A list of commuters
 * @return {Object} An object in the form:
 *   {
 *     allCommutersGeocoded: boolean,
 *     allCommutersStatsCalculated: boolean,
 *     pctGeocoded: number,
 *     pctStatsCalculated: number
 *   }
 */
export const basicStats = memoize(
  (lastCommuterStoreUpdateTime, entityId, commuters) => {
    const pctGeocoded = formatPercent(
      commuters.reduce((accumulator, commuter) => {
        return accumulator + (commuter.geocodeConfidence !== -1 ? 1 : 0)
      }, 0) / commuters.length
    )
    const pctStatsCalculated = formatPercent(
      commuters.reduce((accumulator, commuter) => {
        return accumulator + (commuter.modeStats ? 1 : 0)
      }, 0) / commuters.length
    )
    const allCommutersGeocoded = pctGeocoded === 100
    const allCommutersStatsCalculated = pctStatsCalculated === 100

    return {
      allCommutersGeocoded,
      allCommutersStatsCalculated,
      pctGeocoded,
      pctStatsCalculated
    }
  },
  memoizeKeyResolver
)

export function downloadMatches (ridematches) {
  let csvContent = 'data:text/csv;charset=utf-8,'
  csvContent +=
    'c1_name,c1_addr,c1_confidence,c2_name,c2_addr,c2_confidence,distance\n'

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

export function getSiteOrMultiSiteEntityInfo (props) {
  const {isMultiSite, multiSite, site, sites} = props
  if (isMultiSite) {
    return {
      entity: multiSite,
      hasSiteCalculationError: sites
        ? sites.some(site => site.calculationStatus === 'error')
        : false,
      errorMessage:
        'An error while trying to calculate the accessibility to at least one of the sites in this multi-site analysis.'
    }
  } else {
    return {
      entity: site,
      hasSiteCalculationError: site
        ? site.calculationStatus === 'error'
        : false,
      errorMessage:
        'An error while trying to calculate the accessibility to this site.'
    }
  }
}

/**
 * Generate a key for the memoized function
 *
 * @param  {number}  lastCommuterStoreUpdateTime
 * @param  {Array}  commuters
 * @param  {Boolean} analysisMode
 * @return {string}
 */
function memoizeKeyResolver (
  lastCommuterStoreUpdateTime,
  entityId,
  commuters,
  analysisMode,
  binBy15Minutes
) {
  return `${lastCommuterStoreUpdateTime}-${entityId}-${analysisMode}-${binBy15Minutes}`
}

/**
 * Get the stats about a specific mode.  Data is used in AccessTable.
 *
 * @param {number} lastCommuterStoreUpdateTime  The last update time of the commuter store.
 *   Used for calculating the memoize key.
 * @param {string} entityId The id of the entity in question.
 *   Used for calculating the memoize key.
 * @param {Array} commuters A list of commuters
 * @param {string} analysisMode The mode to analyze
 * @return {Array} An array with objects in the form:
 *   {
 *     bin: string,
 *     num: number,
 *     cumulative: number,
 *     cumulativePct: number
 *   }
 */
export const modeStats = memoize(
  (
    lastCommuterStoreUpdateTime,
    entityId,
    commuters,
    analysisMode,
    binBy15Minutes
  ) => {
    const analysisModeStatsLookup = {}

    commuters.forEach(commuter => {
      let travelTime
      if (commuter.modeStats && commuter.modeStats.hasOwnProperty(analysisMode)) {
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

    /**
     * Helper to make a new row.
     *
     * @param  {number} endOfBinMinutes The maximum minutes of this bin
     * @return {Object}
     */
    function makeNewRow (endOfBinMinutes) {
      return {
        bin: `< ${humanizeDuration(endOfBinMinutes * 60 * 1000)}`,
        num: 0,
        cumulative,
        cumulativePct: cumulative / commuters.length
      }
    }

    if (binBy15Minutes) {
      // create a table that is binned by every 15 minutes
      const travelTimeBins = []
      let curRow = makeNewRow(15)
      for (let i = 5; i <= 120; i += 5) {
        const curSeconds = i * 60
        const numCommutersInThisBin = analysisModeStatsLookup[curSeconds] || 0
        curRow.num += numCommutersInThisBin
        cumulative += numCommutersInThisBin
        if (i % 15 === 0) {
          curRow.cumulative = cumulative
          curRow.cumulativePct = cumulative / commuters.length
          travelTimeBins.push(curRow)
          curRow = makeNewRow(i + 15)
        }
      }
      return travelTimeBins
    } else {
      return Object.keys(analysisModeStatsLookup).sort(
        (a, b) => a - b
      ).map(range => {
        const minutes = range / 60
        const num = analysisModeStatsLookup[range] || 0
        cumulative += num
        return {
          bin: range === 'calculating...'
            ? range
            : `< ${humanizeDuration(minutes * 60 * 1000)}`,
          num,
          cumulative,
          cumulativePct: cumulative / commuters.length
        }
      })
    }
  },
  memoizeKeyResolver
)

/**
 * Calculate ridematches among a list of commuters.
 *
 * @param {number} lastCommuterStoreUpdateTime  The last update time of the commuter store.
 *   Used for calculating the memoize key.
 * @param {string} entityId The id of the entity in question.
 *   Used for calculating the memoize key.
 * @param {Array} commuters A list of commuters
 * @return {Object} An objects in the form:
 *   {
 *     ridematchingAggregateTable: An array used in RidematchesTable,
 *     ridematches: A lookup of which commuters are matched to a certain commuter
 *   }
 */
export const ridematches = memoize(
  (lastCommuterStoreUpdateTime, entityId, commuters) => {
    const ridematches = {}
    const ridematchingAggregateTable = []

    function addRidematch (commuterA, commuterB, distance) {
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

    if (basicStats(lastCommuterStoreUpdateTime, entityId, commuters).allCommutersGeocoded) {
      for (let i = 0; i < commuters.length; i++) {
        const commuterA = commuters[i]
        const commuterAcoordinates = toCoordinates(commuterA.coordinate)
        for (let j = i + 1; j < commuters.length; j++) {
          const commuterB = commuters[j]
          const commuterBcoordinates = toCoordinates(commuterB.coordinate)
          const distanceBetweenCommuters = distance(
            commuterAcoordinates,
            commuterBcoordinates,
            'miles'
          )
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
      commuters.forEach(commuter => {
        const match = ridematches[commuter._id]
        if (match) {
          let binIdx = 0
          while (
            binIdx < ridematchingBinsByMaxDistance.length &&
            match.minDistance > ridematchingBinsByMaxDistance[binIdx]
          ) {
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
    }

    return {
      ridematchingAggregateTable,
      ridematches
    }
  },
  memoizeKeyResolver
)

/**
 * Calculate overall aggregated stats.  Data used in Infographic.
 *
 * @param {number} lastCommuterStoreUpdateTime  The last update time of the commuter store.
 *   Used for calculating the memoize key.
 * @param {string} entityId The id of the entity in question.
 *   Used for calculating the memoize key.
 * @param {Array} commuters A list of commuters
 * @return {Object} An objects in the form:
 *   {
 *     pctWith30MinBike: string,
 *     pctWith60MinTransit: string,
 *     pctWithRidematch: string
 *   }
 */
export const summaryStats = memoize(
  (lastCommuterStoreUpdateTime, entityId, commuters) => {
    // compute summary stats for bike/transit
    let numWith60MinTransit = 0
    let numWith30MinBike = 0

    if (
      basicStats(
        lastCommuterStoreUpdateTime,
        entityId,
        commuters
      ).allCommutersStatsCalculated
    ) {
      commuters.forEach(commuter => {
        if (
          commuter.modeStats.TRANSIT.travelTime > -1 &&
          commuter.modeStats.TRANSIT.travelTime <= 3600
        ) {
          numWith60MinTransit++
        }

        if (
          commuter.modeStats.BICYCLE.travelTime > -1 &&
          commuter.modeStats.BICYCLE.travelTime <= 1800
        ) {
          numWith30MinBike++
        }
      })
    }

    const upToOneMileBinIdx = 2

    return {
      pctWith30MinBike: formatPercentAsStr(
        numWith30MinBike / commuters.length
      ),
      pctWith60MinTransit: formatPercentAsStr(
        numWith60MinTransit / commuters.length
      ),
      pctWithRidematch: formatPercentAsStr(
        ridematches(
          lastCommuterStoreUpdateTime, entityId, commuters
        ).ridematchingAggregateTable[upToOneMileBinIdx].cumulativePct
      )
    }
  },
  memoizeKeyResolver
)
