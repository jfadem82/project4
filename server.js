var
	aws = require('aws-sdk'),
	bcrypt = require('bcrypt'), 
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	cors = require('cors'),
	ejs = require('ejs'),
	express = require('express'),
	server = express(),
	expressSession = require('express-session'),
	jwt = require('jsonwebtoken'),
	methodOverride = require('method-override'),
	mongoose = require('mongoose'),
	morgan = require('morgan'),
	port = process.env.port || 3000,
	path = require('path'),
	apiRouter = require('./api/routes/userRoutes')
	mongoUri = "mongodb://localhost/project4";

	mongoose.connect(mongoUri)

	server.use(morgan('dev'))
	server.use(cookieParser())
	server.use(bodyParser.json())
	server.use(bodyParser.urlencoded({extended: true}))
	server.use(cors())
	server.use(express.static(path.join(__dirname, 'public')))
	server.use('/api', apiRouter)