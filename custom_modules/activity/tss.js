var tssCalc = (activityFcMoyenne, activityMovingTime, userFcMax) => {
  // definition du seuil
  var tss

  var seuil = 200 * 0.80

  var intensityFactor = activityFcMoyenne / seuil

  tss = ((activityMovingTime * activityFcMoyenne * intensityFactor) / (seuil * 3600)) * 100

  if (tss > 0) {
    return Number.parseFloat(tss).toFixed(2)
  } else {
    return null
  }
}

module.exports = tssCalc
