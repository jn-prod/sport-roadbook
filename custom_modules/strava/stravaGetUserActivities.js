var stravaApi = require('strava-v3')

var stravaUserActivities = (stravaRefreshToken, done) => {
  stravaApi.oauth.getToken(stravaRefreshToken, (err, payload, limits) => {
    if (err) {
      done(null)
    } else {
      stravaApi.athlete.listActivities({ 'access_token': payload.access_token }, (err, activities, limits) => {
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
