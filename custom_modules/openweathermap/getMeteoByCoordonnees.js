// node_modules
var request = require('request')

var meteoByCoordonnees = (latitude, longitude, callback) => {
  if (latitude && longitude) {
    var meteoUrl = 'http://api.openweathermap.org/data/2.5/weather?APPID=' + process.env.OPENWEATHERMAP_API_KEY + '&lat=' + latitude + '&lon=' + +longitude + '&units=metric'
    try {
      request(meteoUrl, (error, response, body) => {
        if (error) {
          callback(null)
        } else {
          var meteo = JSON.parse(body)
          var currentWeather = {
            weather_main: meteo.weather[0].main,
            openweathermap_icon: meteo.weather[0].icon,
            main_temp: meteo.main.temp,
            main_pressure: meteo.main.pressure,
            main_humidity: meteo.main.humidity,
            main_temp_min: meteo.main.temp_min,
            main_temp_max: meteo.main.temp_max,
            wind_speed: meteo.wind.speed,
            wind_deg: meteo.wind.deg,
            clouds: meteo.clouds.all,
            sys_sunrise: new Date(meteo.sys.sunrise * 1000),
            sys_sunset: new Date(meteo.sys.sunset * 1000)
          }
          callback(currentWeather)
        }
      })
    } catch (err) {
      if (err) {
        callback(null)
      }
    }
  } else {
    callback(null)
  }
}

module.exports = meteoByCoordonnees
