var express = require('express');
var path = require('path');
var favicon = require('./node_modules/serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var User = require('./models/user');
var Job = require('./models/job');

//Serving a web page
var http = require('http');
//Set up to connect to MongoDB using Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://groupuser:allCollar@ds053658.mongolab.com:53658/allcollardb');

// The http server will listen to an appropriate port, or default to
// port 5000.
var theport = process.env.PORT || 5000;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
});

//Example Users

var johndoe = new User ({
  username: 'jdoe',
  password: 'password',
  name: 'John Doe'
});

// create a new user called chris
var chris = new User({
  name: 'Chris',
  username: 'sevilayha',
  password: 'password' 
});

//Example Jobs

var softjob = new Job ({
  id: '1',
  title: 'Software Developer',
  compensation: '400'
});

// call the custom method. this will just add -dude to his name
// user will now be Chris-dude
chris.dudify(function(err, name) {
  if (err) throw err;

  console.log('Your new name is ' + name);
});

// call the built-in save method to save to the database
chris.save(function(err) {
  if (err) throw err;

  console.log('User saved successfully!');
});

// Saving it to the database.  
johndoe.save(function (err) {if (err) console.log ('Error on save!')});
softjob.save(function (err) {if (err) console.log ('Error on save!')});

var login = require('./routes/login');
var users = require('./routes/users');

var dashboard = require('./routes/dashboard');

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

app.use('/dashboard', dashboard);

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

app.listen(5000);


module.exports = app;
