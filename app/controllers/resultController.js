// models
var Result = require('../models/result')
var Event = require('../models/event')

var convertTime = require('../../custom_modules/tools/convert-time').toNumber

var resultController = {
  getJoinEvent: (req, res) => {
    var config = {
      title: 'Quel est l\'événement correspondant à ce résultat ?',
      section: 'L\'événement pour ce classement n\'a pas encore été créer ?',
      link: 'result'
    }

    Event
      .find({ user: req.session.user._id })
      .exec((err, events) => {
        if (err) {
          res.redirect('/user/' + req.session.user._id)
        }

        if (String(req.session.user._id) === String(events[0].user._id)) {
          res.render('partials/event/join', { events: events, config: config })
        } else {
          res.redirect('/user/' + req.session.user._id)
        }
      })
  },
  getAddEventResult: (req, res) => {
    Event
      .findOne({ _id: req.params.event })
      .exec((err, event) => {
        if (err) {
          res.redirect('/user/' + req.session.user._id)
        }
        if (String(req.session.user._id) === String(event.user._id)) {
          res.render('partials/result/add', { event: event })
        } else {
          res.redirect('/user/' + req.session.user._id)
        }
      })
  },
  postAddEventResult: (req, res) => {
    var form = req.body

    form.user = res.locals.user._id
    form.event = req.params.event

    // convertion du temps HH:mm:ss en secondes
    form.official_time = convertTime(form.official_time_hours, form.official_time_minutes, form.official_time_seconds)

    var newResult = new Result(form)
    newResult.save((err, result) => {
      if (err) throw err
      else {
        res.redirect('/event/' + req.params.event)
      }
    })
  }
}

module.exports = resultController
