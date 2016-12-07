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
