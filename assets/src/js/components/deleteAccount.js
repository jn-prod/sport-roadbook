var deleteAccount = () => {
  $('#delete_account').on('click', (e) => {
    var question = window.confirm('Souhaitez-vous vraiement supprimer votre compte? Cette action est définitive.')
    if (!question) {
      e.preventDefault()
    }
  })
}

export default deleteAccount()
