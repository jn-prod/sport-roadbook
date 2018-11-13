var Event = require('../models/event')
var dateNow = new Date(Date.now())

var eventController = {
  getAddEvent: (req, res) => {
    res.render('partials/event/add')
  },
  postAddEvent: (req, res) => {
    var form = req.body
    form.date_start = new Date(Date.parse(form.date_start))
    form.date_end = new Date(Date.parse(form.date_end))
    form.user = req.session.user._id

    var newEvent = new Event(form)
    newEvent.save((err, event) => {
      if (err) throw err
      else {
        res.redirect('/user/' + req.session.user._id)
      }
    })
  },
  eventsOverview: (req, res) => {
    Event
      .find({ user: req.session.user._id })
      .sort({ start_date: -1 })
      .exec((err, dbEvents) => {
        if (err) throw err
        var events = { next: [], last: [] }

        if (dbEvents.length > 0) {
          dbEvents.forEach((val) => {
            var startdate = new Date(Date.parse(val.date_start))
            if (startdate > dateNow) {
              events.next.push(val)
            } else {
              events.last.push(val)
            }
          })
        }

        res.render('partials/event/overview', { events: events })
      })
  }
}

module.exports = eventController
