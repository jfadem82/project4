// USERS CONTROLLER . crud and auth for the user

var User = require('../models/User'),
	jwt = require('jsonwebtoken'),
	mySpecialSecret = "sausage";


function index(req, res){
	//get all the users
	User.find(function(err, users){
		if(err) res.send(err)
		res.json(users)
	})
}

function create(req, res){
	//create a user
	console.log("sup bro you creatin' ")
	var user = new User()

	user.name = req.body.name
	user.email = req.body.email
	user.password = req.body.password
	user.bio = req.body.bio

	user.save(function(err) {
		if(err){
			if(err.code == 11000){
				return res.json({success: false, message: "username already taken"})
			} else {
				res.send(err)
			}
		}
		res.json({success: true, message: "User created, sick"})
	})
}

function show(req, res){
	// show a single user
	User.findbyId(req.params.user_id, function(err, user){
		if(err) res.send(err)
		res.json(user)
	})
}

function update(req, res){
	//update a user
	User.findById(req.params.user_id, function(err, user){
		if(err) res.send(err)

			if(req.body.name) user.name = req.body.name
			if(req.body.email) user.email = req.body.email
			if(req.body.password) user.password = req.body.password

			user.save(function(err){
				if(err) res.send(err
				res.json({success: true, message "User updated, brah!"}))
		})
	})
}

function destroy(req, res){
	//delete a user
	User.remove({
		_id:req.params.user_id
	}, function(err, user){
		if(err) res.send(err)
		res.json({success: true, message:"You're done, brah!"})
	}
	)
}

//code for apiRouter.route('/authenticate')
function authenticateUser(req, res) {
	console.log('trying to jwt my jwts mayne')
	// 1 - find the user in our db
	User.findOne({
		email: req.body.email
	}).select('name email password bio').exec(function(err, user){
		if(err) throw err
			if(!user){
				res.json({success: false, message: "No such user"})
			} else if(user){
				// check passwords
				var validPassword = user.comparePassword(req.body.password)
				if(!validPassword){
					res.json({success: false, message: "wrong password, BRO"})
				} else {
					//password is good!
					var token = jwt.sign({
						name: user.name,
						email: user.email
					}, mySpecialSecret, {
						expiresInMinutes: 1440	
					})
					// now lets give it to them!
					console.log("logged in")
					res.json({ success: true, message: "enjoy your token", token: token})
				}
			}
	})
}

function checkUser(req, res, next){
	//check everywhere for a JWT
	var token = req.body.token || req.param('token') || req.headers['x-access-token']
	if token{
		jwt.verify(token, mySpecialSecret, function(err, decoded){
			if(err){
				res.status(403).send({success: false, message: "Nah brah, token couldn't be decoded!"})
			} else {
				req.decoded = decoded
				next()
			}
		})
	} else {
		res.status(403).send({success: false, message: "Beat feet brah, you don't have a token!"})
	}
	console.log("checking if brah is logged in, brah")
}

module.exports = {
	index: index,
	create: create,
	show: show,
	update: update,
	destroy: destroy, 
	authenticate: authenticateUser,
	checkUser: checkUser
}