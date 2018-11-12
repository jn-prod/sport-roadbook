var deleteActivity = () => {
  $('.delete-activity').on('click', (e) => {
    var confirm = window.confirm('Souhaitez-vous supprimer cette activitié ?')
    if (!confirm) {
      e.preventDefault()
    }
  })
}

module.exports = deleteActivity()
