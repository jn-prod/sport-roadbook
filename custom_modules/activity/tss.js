var tssFormula = (activityFcMoyenne, activityMovingTime, userFcMax) => {
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

var secondsToHm = (d) => {
  
  d = Number(d)
  if (d >= 0) {
    return d / 3600
  } else {
    return null
  }
}

var rpeToTss = (rpe, time) => {
  var chrono
  if (time >= 0) {
    chrono = secondsToHm(time)
  }

  if (rpe * 1 >= 1 && chrono > 0) {
    if (rpe * 1 === 1) {
      return 20 * chrono
    } else if (rpe * 1 === 2) {
      return 30 * chrono
    } else if (rpe * 1 === 3) {
      return 40 * chrono
    } else if (rpe * 1 === 4) {
      return 50 * chrono
    } else if (rpe * 1 === 5) {
      return 60 * chrono
    } else if (rpe * 1 === 6) {
      return 70 * chrono
    } else if (rpe * 1 === 7) {
      return 80 * chrono
    } else if (rpe * 1 === 8) {
      return 100 * chrono
    } else if (rpe * 1 === 9) {
      return 120 * chrono
    } else if (rpe * 1 === 10) {
      return 140 * chrono
    } else {
      return null
    }    
  } else {
    return null
  }
}

var tssCalc = (activity, configuration) => {
  var dbActivity = activity
  var config = configuration
  var tss

  if (dbActivity !== undefined) {
    // all activity data for next step ?
    if (dbActivity.moving_time * 1 > 0 && dbActivity.fc_moyenne * 1 > 0) {
      config.activity_full_data = true
    } else {
      config.activity_full_data = false
    }

    if (dbActivity.moving_time * 1 > 0 && dbActivity.rpe * 1 > 0) {
      config.convert_rpe = true
    }

    if (config.activity_full_data) {
      // calcul de la fc max du user
      if (dbActivity.user.fc_max > 0) {
        config.user_fc_max = dbActivity.user.fc_max
      } else if ((dbActivity.user.fc_max === null || dbActivity.user.fc_max === undefined) && dbActivity.user.date_of_birth !== null) {
        var birthdate = new Date(dbActivity.user.date_of_birth)
        var dateNow = new Date(Date.now())

        try {
          config.user_fc_max = 220 - (dateNow.getFullYear() - birthdate.getFullYear())
        } catch (err) {
          if (err) {
            config.user_fc_max = 0
          }
        }
      }

      // calcul de la mesure de l'effort - tss
      if (config.user_fc_max > 0) {
        try {
          tss = tssFormula(dbActivity.fc_moyenne, dbActivity.moving_time, config.user_fc_max)
        } catch (err) {
          if (err) {
            tss = null
          }
        }
      } else if (dbActivity.rpe * 1 >= 1) {
        tss = rpeToTss(dbActivity.rpe, dbActivity.moving_time)
      }

      return { activity:  Object.assign({tss: Number(tss)}, dbActivity._doc), config: config }
    } else if (config.convert_rpe) {
      tss = rpeToTss(dbActivity.rpe, dbActivity.moving_time)
      if (tss !== null && tss !== undefined) {
        return { activity:  Object.assign({tss: Number(tss)}, dbActivity._doc), config: config }
      } else {
        return { activity:  dbActivity, config: config }
      }
    } else {
      return { activity:  dbActivity, config: config }
    }
  } else {
    return { activity:  dbActivity, config: config }
  }
}


module.exports = tssCalc
