module.exports = {
  required: false,
  type: {
    isPublic: {
      required: true,
      type: Boolean
    },
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
}
