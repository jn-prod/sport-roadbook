var healthScore = require(__dirname + '/healthScore')
var monthlyRisk = require('../../data/risque-maladie-mensuel.json')

var getMonthlyRiskVal = (array, testValue) => {
  var monthNum
  array.forEach((val) => {
    if(val.mois_num === testValue) {
      monthNum = val.valeur
    }
  })
  return monthNum 
}

// le risque de maladie est-il supérieur à la moyenne française ?
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
