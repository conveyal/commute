/* globals ga */

function init (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r
  // eslint-disable-next-line
  i[r] = i[r] || function () {(i[r].q = i[r].q || []).push(arguments)}, i[r].l = 1 * new Date();
  // eslint-disable-next-line
  a = s.createElement(o),
    m = s.getElementsByTagName(o)[0]
  a.async = 1
  a.src = g
  m.parentNode.insertBefore(a, m)
}

function hasAnalytics () {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    return false
  } else if (!process.env.GOOGLE_ANALYTICS_TRACKING_ID) {
    console.error('GOOGLE_ANALYTICS_TRACKING_ID not set')
    return false
  } else {
    return true
  }
}

export function initialize () {
  if (!hasAnalytics()) return
  init(
    window,
    document,
    'script',
    'https://www.google-analytics.com/analytics.js',
    'ga'
  )

  ga('create', process.env.GOOGLE_ANALYTICS_TRACKING_ID, 'auto')
}

export function pageview (pageName) {
  if (!hasAnalytics()) return
  ga('send', 'pageview', pageName)
}
