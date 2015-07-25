var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


//Serving a web page
var http = require('http');
//Set up to connect to MongoDB using Mongoose
var mongoose = require('mongoose');
mongoose.connect(' mongodb://groupuser:allCollar@ds053658.mongolab.com:53658/allcollardb');

// The http server will listen to an appropriate port, or default to
// port 5000.
var theport = process.env.PORT || 5000;


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
});

//Schemas go Mongoose/MongoDB go here
var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	name: {
    first: String,
    last: { type: String, trim: true }
	},
	phoneNumber: { type: Number, max: 10, min: 9 },
	locale: String,
	resume: String,
	organization: String,
	privilege: String,
	jobHistory: String,
	jobApps: String,
	hunterRating: { type: Number, max: 0, min: 5 },
	employerRating: { type: Number, max: 0, min: 5 }
	});

var jobSchema = new mongoose.Schema({
	id: String,
	title: String,
	fullDesc: String,
	reqSkills: String,
	locale: String,
	employer: String,
	tagList: Array,
	compensation: String,
	length: String,
	applicants: String,
	isPositionFilled: Boolean,
	isCompleted: Boolean
});
	
//Compiling Schema into a Model
var User = mongoose.model('User', userSchema);
var Job = mongoose.model('Job', jobSchema);

//Example User

var johndoe = new User ({
  username: 'jdoe',
  password: 'password',
  name: 'John Doe'
});

var softjob = new Job ({
  id: '1',
  title: 'Software Developer'
});

// Saving it to the database.  
johndoe.save(function (err) {if (err) console.log ('Error on save!')});
softjob.save(function (err) {if (err) console.log ('Error on save!')});

var login = require('./routes/login');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', login);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
