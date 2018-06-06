var healthScore = require('./healthscore')
var monthlyRisk = require('../../data/risque-maladie-mensuel')

var getMonthlyRiskVal = (array, testValue) => {
  var monthNum
  array.forEach((val) => {
    if(val.mois_num === testValue) {
      console.log(val.valeur)
      monthNum = val.valeur
    }
  })
  return monthNum 
}

var getHealthRisk = (val) => {
  var initScore = healthScore(val)
  var initScoreDate = val.created_at.getMonth()
  var riskCoef = getMonthlyRiskVal(monthlyRisk,initScoreDate)

  if(riskCoef >= 0) {
    return false
  } else {
    return true
  }
}

module.exports = getHealthRisk