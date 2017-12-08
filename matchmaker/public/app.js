jQuery(function($){
    var IO = {
        init: function() {
            IO.socket = io.connect();
            IO.bindEvents();
        },
        bindEvents: function(){
            IO.socket.on('connected', IO.onConnected );
            IO.socket.on('newGameCreated', IO.onNewGameCreated );
        },
        onConnected : function() {
            // Cache a copy of the client's socket.IO session ID on the App
            //App.mySocketId = IO.socket.socket.sessionid;
            // console.log(data.message);
        },
        onNewGameCreated : function(data) {
            App.gameInit(data);
        },
    };

    var App = {
        gameId: 0,
        myRole: '',
        numPlayersInRoom: 0,
        init: function () {
            App.cacheElements();
            App.showInitScreen();
            App.bindEvents();
        },
        gameInit: function (data) {
            App.gameId = data.gameId;
            App.mySocketId = data.mySocketId;
            App.myRole = 'Host';
            App.numPlayersInRoom = 0;
            App.displayNewGameScreen(data);
            console.log("Game started with ID: " + App.gameId + ' by host: ' + App.mySocketId);
        },
        bindEvents: function () {
            // Host
            App.$doc.on('click', '#btnCreateGame', function() {
                 console.log('Clicked "Create A Game"');
                IO.socket.emit('hostCreateNewGame');
            });

        },
        cacheElements: function () {
            App.$doc = $(document);
            App.$gameArea = $('#gameArea');
            // Templates
            App.$templateIntroScreen = $('#intro-screen-template').html();
            App.$templateNewGame = $('#create-game-template').html();
            App.$templateJoinGame = $('#join-game-template').html();
        },
        showInitScreen: function() {
            App.$gameArea.html(App.$templateIntroScreen);
        },
        displayNewGameScreen: function(data) {
            App.$gameArea.html(App.$templateNewGame);

            // Display the URL on screen
            $('#gameURL').text(window.location.href);

            // Show the gameId / room id on screen
            $('#spanNewGameCode').text(App.gameId);
        }
    };

    IO.init();
    App.init();

}($));