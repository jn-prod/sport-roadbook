var Event = require('../models/event')

var eventController = {
	getAddEvent: (req, res) => {
		res.render('partials/event/add')
	},
	postAddEvent: (req, res) => {

	},
	eventsOverview: (req, res) => {
		res.render('partials/event/overview')
	}
}

module.exports = eventController