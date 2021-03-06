var Handlebars = require('handlebars')

var helpers = {
  date: (val) => {
    try {
      return val.getDate() + '/' + (parseInt(val.getMonth()) + 1) + '/' + val.getFullYear()
    } catch (err) {
      var date = new Date(Date.parse(val))
      return date.getDate() + '/' + (parseInt(date.getMonth()) + 1) + '/' + date.getFullYear()
    }
  },
  getDay: (val) => { return val.getDate() },
  getMonth: (val) => { return parseInt(val.getMonth()) + 1 },
  getYear: (val) => { return val.getFullYear() },
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
  secondToTimeData: (val) => {
    var secNum = parseInt(val, 10)
    var hours = Math.floor(secNum / 3600)
    var minutes = Math.floor((secNum - (hours * 3600)) / 60) / 60

    return (hours + minutes).toFixed(2)
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
  tss_sentence: (val) => {
    var tss = val * 1
    if (tss >= 0 && tss < 150) {
      return 'Activité peu intensive, pas de fatigue résiduelle.'
    } else if (tss >= 150 && tss < 300) {
      return 'Activité modérée, fatigue et douleurs musculaires possible les jours qui suivent.'
    } else if (tss >= 300 && tss < 450) {
      return 'Activité intensive, fatigue et douleurs musculaires les jours qui suivent.'
    } else if (tss >= 450) {
      return 'Activité très intensive, fatigue et douleurs musculaires nécessitant du repos sur plusieurs jours'
    }
  },
  boolean: (val) => { if (val === true) { return 'oui' } else { return 'non' } },
  sport_select: () => {
    var out = ''
    require('./listes/sport').forEach((val) => {
      out = out + '<option value="' + val.value + '">' + val.name + '</option>'
    })
    return new Handlebars.SafeString(out)
  },
  size_select: () => {
    var out = ''
    for (var i = 1; i < 250; i++) {
      out = out + '<option value="' + i + '">' + i + 'cm</option>'
    }
    return new Handlebars.SafeString(out)
  },
  bpm_select: () => {
    var out = ''
    for (var i = 30; i < 230; i++) {
      out = out + '<option value="' + i + '">' + i + 'bpm</option>'
    }
    return new Handlebars.SafeString(out)
  },
  sex: (val) => {
    if (val === 'M') {
      return 'Homme'
    } else if (val === 'W') {
      return 'Femme'
    } else {
      return ''
    }
  },
  imc_helper: (val) => {
    if (val !== 'NC') {
      var imc = Number(val)
      if (imc < 16.5) {
        return 'Voues êtes en dénutrition ou anorexie'
      } else if (imc >= 16.5 && imc < 18.5) {
        return 'Vous êtes mince'
      } else if (imc >= 18.5 && imc < 25) {
        return 'Vous avez un poids idéal'
      } else if (imc >= 25 && imc < 30) {
        return 'Vous êtes en surpoids'
      } else if (imc >= 30 && imc < 35) {
        return 'Vous êtes en obésité modérée'
      } else if (imc >= 35 && imc < 40) {
        return 'Vous êtes en obésité sévère'
      } else if (imc >= 40) {
        return 'Vous êtes en obésité morbide ou massive'
      } else {
        return ''
      }
    } else {
      return ''
    }
  }
}

module.exports = helpers
