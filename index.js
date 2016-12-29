const feathers = require('feathers')
const rest = require('feathers-rest')
const bodyParser = require('body-parser')
const auth = require('feathers-authentication')
const hooks = require('feathers-hooks')
const service = require('feathers-rethinkdb')
const { thinky, r, type, m } = require('../climate-models/thinky')
const compression = require('compression')
const local = require('feathers-authentication-local');
const jwt = require('feathers-authentication-jwt');
const model = name => [ name, service({ Model: r, name, paginate: { default: 10, max: 50 } }) ]

// Services
const { loggedIn, hashPassword, isOwner, createdAt, updatedAt, disable, addUserId, filterByUser } = require('./permissions')

module.exports = function(models) {

	let app = feathers()
		.configure(rest())
		.configure(hooks())
		.use(bodyParser.json())
		.use(bodyParser.urlencoded({extended: true}))
		.configure(auth({ secret: process.env.SECRET }))
	  .configure(local())
	  .configure(jwt())
		.use(compression({
			filter: (req, res) => /[text|application|document]/i.test(req.headers['content_type']) ? compression.filter(req, res) : false
		}))
		// .use('/', feathers.static(__dirname + '/public'))
		.use('/signup', function(req, res) {
			res.redirect('/')
		})

	models.map(m => app.use(...model(m)))

	app.service('users').before({
		get: disable,
		find: [...loggedIn, filterByUser],
		create: [hashPassword, createdAt],
		update: [...isOwner, updatedAt],
		patch: disable,
		remove: disable
	})

	return app
}
