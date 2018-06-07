var reducer = (accumulator, currentValue) => accumulator + currentValue;

var getHealthScore = (val) => {
  var blessure, maladie
  if(val.blessure === false) {
    blessure = 5
  } else {
    blessure = 0
  }
  if(val.maladie === false) {
    maladie = 5
  } else {
    maladie = 0
  }
  var markeurs = [val.humeur, val.sommeil, val.lassitude, val.recuperation, val.stress, val.faim, val.soif, blessure, maladie]
  var score = markeurs.reduce(reducer)
  var highScore = markeurs.length * 5

  var dayScore = parseInt(score / highScore * 100)

  return dayScore
}

module.exports = getHealthScore
