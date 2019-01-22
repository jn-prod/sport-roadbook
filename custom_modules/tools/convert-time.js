var convertTime = {
  toNumber: (hours, minutes, seconds) => {
    return (hours * 60 * 60) + (minutes * 60) + parseInt(seconds)
  }
}

module.exports = convertTime
