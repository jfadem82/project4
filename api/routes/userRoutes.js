var 
	express = require('express'),
	apiRouter = express.Router(),
	usersController = require('../controllers/usersController'),
	User = require('../models/User')

apiRouter.route('/users')
	.post(usersController.create)

apiRouter.route('/authenticate')
	.post(usersController.authenticate)


apiRouter.use(usersController.checkUser)

apiRouter.route('/users')
	.get(usersController.index)

apiRouter.route('/me')
	.get(function(req, res){
		res.send(req.decoded)
	})

apiRouter.route('users/:user_id')
	.get(usersController.show)
	.put(usersController.update)
	.delete(usersController.destroy)

module.exports = apiRouter
