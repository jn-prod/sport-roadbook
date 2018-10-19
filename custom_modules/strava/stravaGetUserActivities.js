var stravaApi = require('strava-v3')

var stravaUserActivities = (stravaId, stravaCode, done) => {
  stravaApi.oauth.getToken(stravaCode, (err, payload, limits) => {
    var userToken = payload.access_token
    if (err) {
      done(null)
    } else {
      stravaApi.athlete.listActivities({ 'access_token': userToken }, (err, activities, limits) => {
        if (err) {
          done(null)
        } else {
          done(activities)
        }
      })
    }
  })
}

module.exports = stravaUserActivities
