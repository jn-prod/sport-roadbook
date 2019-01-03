var Team = require('../models/team')
var Event = require('../models/event')
var dateNow = new Date(Date.now())

var allowedInTeam = (user, coach, membres) => {
  var owner = String(coach) === String(user)
  var isMember

  // visiteur is membre
  if (membres.length >= 1) {
    isMember = membres.find((membre) => {
      var find = String(membre._id) === user
      if (find === undefined) {
        return false
      } else {
        return find
      }
    })
  } else {
    isMember = false
  }

  // coach as always member fonctionnality
  if (owner) {
    isMember = true
  }
  return {
    owner: owner,
    is_member: isMember
  }
}

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
              res.redirect('/team/' + req.session.user._id + '/overview')
            })
        } else {
          res.redirect('/team/' + req.session.user._id + '/overview')
        }
      })
  },
  teamDetails: (req, res) => {
    Team
      .findById(req.params.team)
      .populate('membres')
      .populate('coach')
      .populate('events')
      .exec((err, team) => {
        if (err) {
          res.redirect('/user/' + req.session.user._id)
        }

        var config = allowedInTeam(req.session.user._id, team.coach._id, team.membres)

        if (config.is_member !== false) {
          Event
            .find({ user: req.session.user._id, date_start: { $gte: dateNow } })
            .sort({ start_date: -1 })
            .exec((err, userEvents) => {
              if (err) {
                res.render('partials/team/details', { team: team, config: config })
              }

              var filtredUserEvents = []

              if (userEvents.length >= 1 && team.events.length >= 1) {
                userEvents.forEach((event) => {
                  var find = team.events.find((search) => {
                    return String(search._id) === String(event._id)
                  })
                  if (find === undefined || find === false) {
                    filtredUserEvents.push(event)
                  }
                  return find
                })
              }
              res.render('partials/team/details', { team: team, config: config, user_events: filtredUserEvents })
            })
        } else {
          res.render('partials/team/details', { team: team, config: config })
        }
      })
  },
  teamAddEvent: (req, res) => {
    Team
      .findById(req.params.team)
      .populate('coach')
      .populate('membres')
      .exec((err, team) => {
        if (err) {
          res.redirect('/team/' + req.params.team)
        }

        var config = allowedInTeam(req.session.user._id, team.coach._id, team.membres)

        if (config) {
          Team
            .findOneAndUpdate({ _id: req.params.team }, { $push: { events: req.params.event } }, (err, doc) => {
              if (err) {
                res.redirect('/team/' + req.params.team)
              }
              res.redirect('/team/' + req.params.team)
            })
        } else {
          res.redirect('/team/' + req.params.team)
        }
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
