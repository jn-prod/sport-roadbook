var Event = require('../models/event')
var Result = require('../models/result')
var Activity = require('../models/activity')
var dateNow = new Date(Date.now())

// node_modules
var Promise = require('bluebird')

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
        res.redirect('/event/' + req.session.user._id + '/overview')
      }
    })
  },
  eventDetails: (req, res) => {
    var dbEvent = new Promise((resolve, reject) => {
      Event
        .findById(req.params.event)
        .populate('user')
        .exec((err, event) => {
          if (err) {
            reject(err)
          }
          resolve(event)
        })
    })

    var dbResults = new Promise((resolve, reject) => {
      Result
        .find({ event: req.params.event })
        .exec((err, results) => {
          if (err) {
            reject(err)
          }
          resolve(results)
        })
    })

    var dbActivities = new Promise((resolve, reject) => {
      var config = {
        activity_full_data: false
      }

      Activity
        .find({ event: req.params.event, user: { $ne: null } })
        .populate('user')
        .exec((err, activities) => {
          if (err) {
            reject(err)
          }
          if (activities.length > 0) {
            activities.forEach((activity) => {
              var tss
              try {
                tss = require('../../custom_modules/activity/tss')(activity, config)
                activity.tss = tss.activity.tss
              } catch (err) {
                if (err) {
                  tss = 0
                }
              }
            })
          }
          resolve(activities)
        })
    })

    Promise
      .props({
        results: dbResults,
        event: dbEvent,
        activities: dbActivities
      })
      .then((api) => {
        api.config = {
          owner: String(api.event.user._id) === String(req.session.user._id)
        }

        if (api.results.length >= 1) {
          api.results.forEach((result) => {
            if (Number(result.place) > 0 && Number(result.finishers_qty) > 0) {
              result.indice = Number.parseFloat(Number(result.place) / Number(result.finishers_qty) * 100).toFixed(2)
            }
          })
        }
        res.render('partials/event/details', api)
      })
      .catch((err) => {
        if (err) {
          res.redirect('/user/' + req.session.user._id)
        }
      })
  },
  deleteEvent: (req, res) => {
    Event
      .findOneAndUpdate({
        _id: req.params.event
      }, {
        $set: { user: null }
      }, (err) => {
        if (err) throw err
      })
    // finale redirection
    res.redirect('/event/' + req.session.user._id + '/overview')
  },
  eventsOverview: (req, res) => {
    Event
      .find({ user: req.session.user._id })
      .sort({ start_date: -1 })
      .exec((err, dbEvents) => {
        if (err) {
          res.redirect('/user/' + req.session.user._id)
        }
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

        if (events.last.length > 0) {
          events.last.sort((a, b) => {
            return b.date_start - a.date_start
          })
        }

        res.render('partials/event/overview', { events: events })
      })
  }
}

module.exports = eventController
