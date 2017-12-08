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
            IO.socket.on('playerJoinRoom', IO.playerJoinRoom);
        },
        onConnected: function () {
            // Cache a copy of the client's socket.IO session ID on the App
            App.mySocketId = IO.socket;
            // console.log(data.message);
        },
        onNewGameCreated: function (data) {
            App.room.gameInit(data);
        },
        playerJoinedRoom : function(data) {

            console.log(App.myRole);
            App[App.myRole].updateWaitingScreen(data);
        },
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
        },
        showInitScreen: function () {
            App.$gameArea.html(App.$templateIntroScreen);
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
                App.myRole = 'Host';
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
                App.room.players.push(data);
                App.room.numPlayersInRoom += 1;
                if (App.room.numPlayersInRoom === 2) {
                    IO.socket.emit('hostRoomFull',App.gameId);
                }
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
        }
    };

    IO.init();
    App.init();

}($));