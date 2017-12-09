var express = require('express');

var app = express();
var server = app.listen(process.env.PORT || 3000, listen);

function listen(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://" + host + ":" + port);
}

app.use(express.static('public'));

var io = require('socket.io')(server);

io.sockets.on('connection',
    function(socket){
        socket.on('mouse', function(data){
            socket.broadcast.emit('mouse', data);
        });
    });