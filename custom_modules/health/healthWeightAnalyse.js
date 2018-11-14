// formule de Deurenberg : IMG (%) = (1.20∗IMC) + (0.23∗Age) − (10.8∗Sexe) − 5.4
var healthWeightAnalyse = (poids, taille, dateNaissance, dateActivity, sex) => {
  var weightAnalyse = {
    imc: null,
    img: null
  }
  var sexValue

  // IMC
  var imcCalc = poids / (taille / 100 * taille / 100)
  weightAnalyse.imc = Number.parseFloat(imcCalc).toFixed(2)

  // IMG
  var userDateOfBirth = new Date(Date.parse(dateNaissance))
  var healthDate = new Date(Date.parse(dateActivity))
  var userAge = Number(healthDate.getFullYear()) - Number(userDateOfBirth.getFullYear())

  if (sex === 'W') {
    sexValue = 0
  } else if (sex === 'M') {
    sexValue = 1
  }

  var imgCalc = (1.20 * weightAnalyse.imc) + (0.23 * userAge) - (10.8 * sexValue) - 5.4
  weightAnalyse.img = Math.round(imgCalc * 100) / 100

  return weightAnalyse
}

module.exports = healthWeightAnalyse
