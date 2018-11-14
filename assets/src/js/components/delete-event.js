var deleteActivity = () => {
  $('.delete-event').on('click', (e) => {
    var confirm = window.confirm('Souhaitez-vous supprimer cet événement ?')
    if (!confirm) {
      e.preventDefault()
    }
  })
}

module.exports = deleteActivity()
