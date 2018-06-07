var helpers = {
  date: (val) => { return val.getDate() + '/' + (parseInt(val.getMonth()) + 1) + '/' + val.getFullYear() },
  dateStrava: (val) => { var date = new Date(val); return date.getDate() + '/' + (parseInt(date.getMonth()) + 1) + '/' + date.getFullYear() },
  secondToTime: (val) => {
    var secNum = parseInt(val, 10)
    var hours = Math.floor(secNum / 3600)
    var minutes = Math.floor((secNum - (hours * 3600)) / 60)
    var seconds = secNum - (hours * 3600) - (minutes * 60)

    if (hours < 10) { hours = '0' + hours }
    if (minutes < 10) { minutes = '0' + minutes }
    if (seconds < 10) { seconds = '0' + seconds }
    return hours + ':' + minutes + ':' + seconds
  },
  rpe: (val) => { return val / 10 * 100 },
  stravaDist: (val) => { var dist = val / 1000; return Number.parseFloat(dist).toFixed(3) },
  adverageSpeed: (sport, dist, time) => {
    if (sport.toUpperCase() === 'RUN' || sport.toUpperCase() === 'TRAIL') {
      var speed = Number.parseFloat((time / 60) / (dist / 1000)).toFixed(2)
      var min = String(speed).split('.')[0]
      var sec = parseInt(String(speed).split('.')[1] * 60 / 100)
      return min + ':' + sec + 'min/Km'
    } else {
      return Number.parseFloat((dist / 1000) / (time / 3600)).toFixed(2) + 'Km/h'
    }
  },
  boolean: (val) => { if (val === true) { return 'oui' } else { return 'non' } }
}

module.exports = helpers
