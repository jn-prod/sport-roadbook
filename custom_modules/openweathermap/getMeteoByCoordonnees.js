// node_modules
var request = require('request')

var meteoByCoordonnees = (latitude, longitude, callback) => {
  if (latitude && longitude) {
    var meteoUrl = 'http://api.openweathermap.org/data/2.5/weather?APPID=' + process.env.OPENWEATHERMAP_API_KEY + '&lat=' + latitude + '&lon=' + +longitude + '&units=metric'
    request(meteoUrl, (error, response, body) => {
      var body = JSON.parse(body)
      var currentWeather = {
        weather_main: body.weather[0].main,
        openweathermap_icon: body.weather[0].icon,
        main_temp: body.main.temp,
        main_pressure: body.main.pressure,
        main_humidity: body.main.humidity,
        main_temp_min: body.main.temp_min,
        main_temp_max: body.main.temp_max,
        wind_speed: body.wind.speed,
        wind_deg: body.wind.deg,
        clouds: body.clouds.all,
        sys_sunrise: new Date(body.sys.sunrise * 1000),
        sys_sunset: new Date(body.sys.sunset * 1000)
      }
      callback(currentWeather)
    })
  } else {
    resolve(null)
  }
}

module.exports = meteoByCoordonnees
