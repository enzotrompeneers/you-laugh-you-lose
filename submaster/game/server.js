var io;
var gameSocket;

/**
 * This function is called by index.js to initialize a new game instance.
 *
 * @param sio The Socket.IO library
 * @param socket The socket object for the connected client.
 */

exports.initGame = function(sio, socket){
    io = sio;
    gameSocket = socket;
    gameSocket.emit('connected', { message: "You are connected!" });

    // Host Events
    gameSocket.on('hostCreateNewGame', hostCreateNewGame);
    gameSocket.on('hostRoomFull', hostPrepareGame);
    gameSocket.on('hostCountdownFinished', hostStartGame);

    // Player Events
    gameSocket.on('countDown', playerCountDown);
   gameSocket.on('playerJoinRoom', playerJoinRoom);
};
function hostCreateNewGame() {
    // Create a unique Socket.IO Room
    var thisGameId = ( Math.random() * 100000 ) | 0;
    // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
    this.emit('newGameCreated', {gameId: thisGameId, mySocketId: this.id});

    // Join the Room and wait for the players
    gameSocket.join(thisGameId, function () {
    console.log(gameSocket.rooms); // [ <socket.id>, 'room 237' ]
});
};

function hostStartGame(gameId) {
    console.log('Game Started.');
    io.sockets.in(gameId).emit('gameStarted', 'hallo iedereen welkom bij de game');
};
function hostPrepareGame(gameId) {
    var sock = this;
    var data = {
        mySocketId : sock.id,
        gameId : gameId
    };
    console.log("All Players Present. Preparing game...");
    io.sockets.in(data.gameId).emit('beginNewGame', data);
}
function playerJoinRoom(data) {
    console.log('Player ' + data.playerName + ' attempting to join game: ' + data.gameId );
    var sock = this;
    data.mySocketId = sock.id;
    sock.join(data.gameId);
    io.sockets.in(data.gameId).emit('playerJoinedRoom', data);
}
function playerCountDown(data){
    console.log(data[1]);
    io.sockets.in(data[0]).emit('playCountDown', data[1]);
}