var getLocation = (locationCb) => {
  $.getJSON('http://api.ipapi.com/check?access_key=47205444bce06ace12eb9468f268109e', (data) => {
    console.log(data)
    var location = {latitude: data.location.latitude, longitude: data.location.longitude}
    locationCb(location)
  })
}

export default getLocation
