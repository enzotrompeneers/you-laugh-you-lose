require('dotenv').config();

// Import the Express module
var express = require('express');

// Import the 'path' module (packaged with Node.js)
var path = require('path');

// Create a new instance of Express
var app = express();

var  connectServer = require('./server');


app.use(express.static(path.join(__dirname,'public')));
// Create a Node.js based http server on port 8080
var server = require('http').createServer(app).listen(process.env.PORT || 3000);

// Create a Socket.IO server and attach it to the http server
var io = require('socket.io').listen(server);

var i = 1;
// Listen for Socket.IO Connections. Once connected, start the game logic.
io.sockets.on('connection', function (socket) {
    console.log('client connected');
    connectServer.initGame(io, socket);

    socket.on('stream', function(data) {
        i++;
        console.log(i%30);
        if(i%30 == 0) {
            var filename = Math.floor(new Date() / 1000);
            require("fs").writeFile('./images/'+filename+ ".png", data, 'base64', function(err) {
                console.log(err);
                videoController.checkIfLaughing('./images/'+filename+ ".png", function(laughDetected) {
                    console.log("was a smile detected?:" + detected);
                });
            });
        }
        socket.broadcast.emit('stream', data);
    });
});

var youtubeController = require('./controllers/youtubeController');
app.get('/search/:searchterm', function(req, res, next) {
    youtubeController.search(req.params.searchterm, function(result) {
        res.json(result);
    });
});

var videoController = require('./controllers/videoController');