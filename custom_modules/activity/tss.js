var tss = (fcMoyenne, movingTime, fcMax) => {
  // definition du seuil
  var seuil

  if (fcMax !== undefined) {
    seuil = fcMax * 0.80
  } else {
    seuil = 200 * 0.80
  }
  var intensityFactor = fcMoyenne / seuil

  return ((movingTime * fcMoyenne * intensityFactor) / (seuil * 3600)) * 100
}

module.exports = tss
