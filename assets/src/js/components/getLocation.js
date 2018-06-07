var activePages = [$('form#forme')]

var createInput = (name, value) => {
  return '<input type="hidden" name="' + name + '" value="' + value + '">'
}

var getLocation = (validation) => {
  if (validation.length >= 1) {
    $.getJSON('https://geoip.nekudo.com/api/', (data) => {
      var location = {latitude: data.location.latitude, longitude: data.location.longitude}
      var inputs = [
        createInput('latitude', location.latitude),
        createInput('longitude', location.longitude)
      ]
      inputs.forEach((val) => {
        validation.append(val)
      })
    })
  }
}

var addInputLocation = () => {
  var playOne = activePages
  playOne.forEach((val) => {
    getLocation(val)
  })
}

export default addInputLocation()
