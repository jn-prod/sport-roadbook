// Strava
var strava = new require("strava")({
  client_id: process.env.STRAVA_ID, 
  client_secret: process.env.STRAVA_SECRET,
  redirect_uri: "localhost",
  access_token: process.env.STRAVA_ACCESS,
  code: ''
});

module.exports = strava