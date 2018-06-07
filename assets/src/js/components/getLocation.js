var getLocation = (locationCb) => {
  $.getJSON('https://geoip.nekudo.com/api/', (data) => {
    var location = {latitude: data.location.latitude, longitude: data.location.longitude}
    locationCb(location)
  })
}

export default getLocation
