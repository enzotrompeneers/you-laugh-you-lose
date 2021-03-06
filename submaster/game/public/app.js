jQuery(function ($) {
    var IO = {
        init: function () {
            IO.socket = io.connect();
            IO.bindEvents();
        },
        /**
         * Listen to socket.io events
         */
        bindEvents: function () {
            IO.socket.on('connected', IO.onConnected);
            IO.socket.on('newGameCreated', IO.onNewGameCreated);
            IO.socket.on('playerJoinedRoom', IO.playerJoinedRoom);
            IO.socket.on('beginNewGame', IO.beginNewGame );
            IO.socket.on('gameStarted', IO.gameStarted);
            IO.socket.on('playCountDown', IO.showCountDown)
        },
        onConnected: function () {
            // Cache a copy of the client's socket.IO session ID on the App
            App.mySocketId = IO.socket.id;
            // console.log(data.message);
        },
        onNewGameCreated: function (data) {
            App.room.gameInit(data);
        },
        beginNewGame : function(data) {
            console.log(data);
            App[App.myRole].beginGame(data);
        },
        playerJoinedRoom : function(data) {

            console.log(App.myRole);
            App[App.myRole].updateWaitingScreen(data);
        },
        showCountDown : function (data) {
            App.player.updateCountDown(data);
        },
        gameStarted : function () {
            
        }
    };

    var App = {
        gameId: 0,
        myRole: '',
        numPlayersInRoom: 0,
        hostSocketId: '',

        init: function () {
            App.cacheElements();
            App.showInitScreen();
            App.bindEvents();
        },

        bindEvents: function () {
            // Host
            App.$doc.on('click', '#btnCreateGame', function () {
                App.room.onCreateClick();
            });
            App.$doc.on('click', '#btnJoinGame', function () {
                App.$gameArea.html(App.$templateJoinGame);
            });
            App.$doc.on('click', '#btnStart', function () {
                App.player.onPlayerStartClick();
            });
        },
        cacheElements: function () {
            App.$doc = $(document);
            App.$gameArea = $('#gameArea');

            App.$templateIntroScreen = $('#intro-screen-template').html();
            App.$templateNewGame = $('#create-game-template').html();
            App.$templateJoinGame = $('#join-game-template').html();
            App.$hostGame = $('#host-game-template').html();
        },
        showInitScreen: function () {
            App.$gameArea.html(App.$templateIntroScreen);
        },
        countDown : function( $el, startTime, callback) {

            // Display the starting time on the screen.
            $el.text(startTime);



            // Start a 1 second timer
            var timer = setInterval(countItDown,1000);

            // Decrement the displayed timer value on each 'tick'
            function countItDown(){
                startTime -= 1
                $el.text(startTime);
                IO.socket.emit('countDown', [App.gameId, startTime]);
                if( startTime <= 0 ){
                    // console.log('Countdown Finished.');

                    // Stop the timer and do the callback.
                    clearInterval(timer);
                    callback();
                    return;
                }
            }

        },
        /**
         * ROOM
         */
        room : {
            players: [],
            numPlayersInRoom: 0,
            gameInit: function (data) {
                App.gameId = data.gameId;
                App.mySocketId = data.mySocketId;
                App.myRole = 'room';
                App.numPlayersInRoom = 0;
                App.room.displayNewGameScreen(data);
                console.log("Game started with ID: " + App.gameId + ' by host: ' + App.mySocketId);
            },
            onCreateClick: function () {
                // console.log('Clicked "Create A Game"');
                IO.socket.emit('hostCreateNewGame');
            },
            displayNewGameScreen: function (data) {
                App.$gameArea.html(App.$templateNewGame);

                // Display the URL on screen
                $('#gameURL').text(window.location.href);

                // Show the gameId / room id on screen
                $('#spanNewGameCode').text(App.gameId);
            },
            updateWaitingScreen: function(data) {
                // Update host screen
                $('#playersWaiting')
                    .append('<p/>')
                    .text('Player ' + data.playerName + ' joined the game.');
                if(App.room.numPlayersInRoom !== 2){
                    App.room.players.push(data);
                    App.room.numPlayersInRoom += 1;
                    console.log(App.room.numPlayersInRoom);
                }

                if (App.room.numPlayersInRoom === 2) {
                    console.log('players connected', App.room.players);
                    IO.socket.emit('hostRoomFull',App.gameId);
                }
            },
            beginGame : function() {

                // Prepare the game screen with new HTML
                App.$gameArea.html(App.$hostGame);

                // Begin the on-screen countdown timer
                var $secondsLeft = $('#hostWord');
                App.countDown( $secondsLeft, 5, function(){
                    IO.socket.emit('hostCountdownFinished', App.gameId);
                });

                // Display the players' names on screen
                $('#player1Score')
                    .find('.playerName')
                    .html(App.room.players[0].playerName);

                $('#player2Score')
                    .find('.playerName')
                    .html(App.room.players[1].playerName);

                // Set the Score section on screen to 0 for each player.
                $('#player1Score').find('.score').attr('id',App.room.players[0].mySocketId);
                $('#player2Score').find('.score').attr('id',App.room.players[1].mySocketId);
            },
        },
        /**
         * PLAYER
         */
        player : {
            /**
             * A reference to the socket ID of the Host
             */
            hostSocketId: '',

            /**
             * The player's name entered on the 'Join' screen.
             */
            myName: '',
            onPlayerStartClick: function() {
                console.log('Player clicked "Start"');

                // collect data to send to the server
                var data = {
                    gameId : +($('#inputGameId').val()),
                    playerName : $('#inputPlayerName').val() || 'anon'
                };

                // Send the gameId and playerName to the server
                IO.socket.emit('playerJoinRoom', data);

                // Set the appropriate properties for the current player.
                App.myRole = 'player';
                App.player.myName = data.playerName;
            },
            updateCountDown : function(data){
                console.log(data);
                $('#gameArea')
                    .html('<div class="gameOver">' + data + '</div>');
            },
            beginGame : function(hostData) {
                App.player.hostSocketId = hostData.mySocketId;
                $('#gameArea')
                    .html('<div class="gameOver">Get Ready!</div>');
            },
            updateWaitingScreen : function(data) {
                console.log(IO.socket.id);
                if(IO.socket.id === data.mySocketId){
                    App.myRole = 'player';
                    App.gameId = data.gameId;

                    $('#playerWaitingMessage')
                        .append('<p/>')
                        .text('Joined Game ' + data.gameId + '. Please wait for game to begin.');
                }
            },
        }
    };

    IO.init();
    App.init();

}($));