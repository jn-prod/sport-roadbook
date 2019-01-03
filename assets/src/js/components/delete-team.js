var deleteTeam = () => {
  $('.delete-team').on('click', (e) => {
    var confirm = window.confirm('Souhaitez-vous supprimer cette team ?')
    if (!confirm) {
      e.preventDefault()
    }
  })
}

module.exports = deleteTeam()
