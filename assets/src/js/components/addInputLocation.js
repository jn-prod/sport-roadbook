import getLocation from './getLocation'

// array of form where add input
var activeInput = [$('form#forme')]

var createInput = (name, value) => {
  return '<input type="hidden" name="' + name + '" value="' + value + '">'
}

var createInputLocation = (validation) => {
  getLocation((val) => {
    if (val) {
      var inputs = [
        createInput('latitude', val.latitude),
        createInput('longitude', val.longitude)
      ]
      inputs.forEach((val) => {
        validation.append(val)
      })
    }
  })
}

var addInputLocation = () => {
  var playOne = activeInput
  playOne.forEach((val) => {
    createInputLocation(val)
  })
}

export default addInputLocation()
