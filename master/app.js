require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var io = require('socket.io')(app);

var app = express();

var matchmakingController = require('./controllers/matchmakingController');
var youtubeController = require('./controllers/youtubeController');
var videoController = require('./controllers/videoController');
var drawController = require('./controllers/drawController');

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

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
*
* Yawuar's code
*
*/

io.on('socket', function(socket) {
  socket.on('stream', function(image) {
    socket.broadcast.emit('stream', image);
  });
});

// var line_history = [];
io.on('socket', function (socket) {
  socket.on('msg', function (data) {
    socket.broadcast.emit('msg', msg);
 });
});

/* GET searchterms (ajax request) */
app.get('/search/:searchterm', function(req, res, next) {
  youtubeController.search(req.params.searchterm, function(result) {
    res.json(result);
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
