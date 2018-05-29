var formSubmit = () => {
  $('form').on('submit', (e) => {
    var formId = $('form').attr('id')
    if (formId === 'activité' || formId === 'forme') {
      var question = window.confirm('Souhaitez-vous valider cette ' + formId + '?')
      if (!question) {
        e.preventDefault()
      }
    }
  })
}

export default formSubmit()
