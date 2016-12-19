/**
 * Create a task queue that is limited by various time constraints:
 * - example:  maximum 6 requests per second and maximum 30 requests per minute
 *
 * @param  {Mixed} timePeriodConstraints  An array of objects with the following config:
 * - maxRequestsPerTimePeriod {Number}  The maximum number of request for this time period
 * - timePeriodLength {Number}          The milliseconds of this time period
 * @return {Object}                       A queue object with the push method to push functions to.
 */
module.exports = function timedQueue (timePeriodConstraints) {
  const taskStack = []
  const numRequestsPerConstraint = timePeriodConstraints.map(() => 0)

  const processRequests = () => {
    // determine if it is possible to run
    while (taskStack.length > 0 &&
      timePeriodConstraints.every((constraint, idx) => {
        return numRequestsPerConstraint[idx] < constraint.maxRequestsPerTimePeriod
      })) {
      // possible to make a request, initiate one request
      const newRequest = taskStack.pop()
      newRequest()

      // set timeouts to decrement timePeriod constraints
      timePeriodConstraints.forEach((constraint, idx) => {
        numRequestsPerConstraint[idx]++
        setTimeout(() => {
          numRequestsPerConstraint[idx]--
          processRequests()
        }, constraint.timePeriodLength)
      })
    }
  }

  return {
    push: (task) => {
      // TODO: implement as queue so it does FIFO
      taskStack.push(task)
      processRequests()
    }
  }
}
