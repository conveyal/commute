module.exports = {
  required: false,
  sections: [{
    type: {
      required: true,
      type: String
    },
    mode: {
      required: false,
      type: String
    },
    cutoff: {
      required: false,
      type: Number
    }
  }]
}
