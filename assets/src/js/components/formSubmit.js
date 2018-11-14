var formSubmit = () => {
  $('form').on('submit', (e) => {
    var formId = $('form').attr('id')
    if (formId === 'activité' || formId === 'forme' || formId === 'événement' || formId === 'profil') {
      var answer
      if (formId === 'activité') {
        answer = 'Souhaitez-vous valider cette activité ?'
      } else if (formId === 'forme') {
        answer = 'Souhaitez-vous valider cette forme ?'
      } else if (formId === 'événement') {
        answer = 'Souhaitez-vous valider cet événement ?'
      } else if (formId === 'profil') {
        answer = 'Souhaitez-vous valider ce profil ?'
      }

      var question = window.confirm(answer)
      if (!question) {
        e.preventDefault()
      }
    }
  })
}

export default formSubmit()
