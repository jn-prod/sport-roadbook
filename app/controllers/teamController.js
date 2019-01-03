var Team = require('../models/team')

var eventController = {
  getAddTeam: (req, res) => {
    res.render('partials/team/add')
  },
  postAddTeam: (req, res) => {
    var form = req.body
    form.coach = req.session.user._id
    form.membres = [req.session.user._id]

    var newTeam = new Team(form)
    newTeam.save((err, event) => {
      if (err) throw err
      else {
        res.redirect('/team/' + req.session.user._id + '/overview')
      }
    })
  },
  deleteTeam: (req, res) => {
    Team
      .findById(req.params.team)
      .populate('coach')
      .exec((err, team) => {
        if (err) throw err
        if (String(team.coach._id) === String(req.session.user._id)) {
          Team
            .findByIdAndUpdate(req.params.team, { $set: { coach: null } }, (err, doc) => {
              if (err) throw err
              // finale redirection
              res.redirect('/user/' + req.session.user._id)
            })
        } else {
          res.redirect('/user/' + req.session.user._id)
        }
      })

    Team
      .findOneAndUpdate({
        _id: req.params.team
      }, {
        $set: { coach: null }
      }, (err) => {
        if (err) throw err
      })
    // finale redirection
    res.redirect('/team/' + req.session.user._id + '/overview')
  },
  teamDetails: (req, res) => {
    Team
      .findById(req.params.team)
      .populate('membres')
      .populate('coach')
      .exec((err, team) => {
        if (err) {
          res.redirect('/user/' + req.session.user._id)
        }
        var config = {
          owner: String(team.coach._id) === String(req.session.user._id)
        }

        res.render('partials/team/details', { team: team, config: config })
      })
  },
  teamOverview: (req, res) => {
    var config = {
      owner: String(req.params.user) === String(req.session.user._id)
    }

    Team
      .find({ coach: req.params.user })
      .populate('membres')
      .exec((err, teams) => {
        if (err) {
          res.redirect('/user/' + req.session.user._id)
        }

        res.render('partials/team/overview', { teams: teams, config: config })
      })
  }
}

module.exports = eventController
