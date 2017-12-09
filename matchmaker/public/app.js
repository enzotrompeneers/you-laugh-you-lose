jQuery(function ($) {
    var socket = io.connect('http://localhost:3000');
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
            IO.socket.on('playCountDown', IO.showCountDown);
            IO.socket.on('uMoederEmitted', IO.uMoederEmitted);
            IO.socket.on('ytEmitted', IO.ytEmitted);
            IO.socket.on('gifEmitted', IO.gifEmitted);
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
          App.player.showVideo();
        },
        uMoederEmitted : function (data) {
            console.log(data);
        },
        ytEmitted : function (data) {
            console.log(data);
            console.log(App.player.myName);
            if(data[1].myName !== App.player.myName){
                $('.thumbnail-wrapper').empty();
                $('.iframe-wrapper').empty();
                $( "<iframe width='560' height='315' src='" + data[2] + "?autoplay=1'frameborder='0' gesture='media' allow='encrypted-media' allowfullscreen</iframe>" ).appendTo( ".iframe-wrapper" );
            }
        },
        gifEmitted : function (data) {
            console.log(data);
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
                console.log('btnJoinGame');
                App.$gameArea.html(App.$templateJoinGame);
            });
            App.$doc.on('click', '#btnStart', function () {
                App.player.onPlayerStartClick();
            });
            App.$doc.on('click', '#btnuMoeder', function () {
                App.player.onUmoederClick();
            });
            App.$doc.on('click', '#btnYtSearch', function () {
                App.player.onYtSearchClick();
            });
            App.$doc.on('keydown', '#outube-search', function () {
                console.log("lol");
                if (e.keyCode == 13) {
                    App.player.onYtSearchClick();
                }
            });
        },
        cacheElements: function () {
            App.$doc = $(document);
            App.$gameArea = $('#gameArea');

            App.$templateIntroScreen = $('#intro-screen-template').html();
            App.$templateNewGame = $('#create-game-template').html();
            App.$templateJoinGame = $('#join-game-template').html();
            App.$hostGame = $('#host-game-template').html();
            App.$startGame = $('#start-game-template').html();
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
        loadCam : function (stream) {
            var webrtc = new SimpleWebRTC({
                // the id/element dom element that will hold "our" video
                localVideoEl: 'video',
                // the id/element dom element that will hold remote videos
                remoteVideosEl: 'remoteVideos',
                // immediately ask for camera access
                autoRequestMedia: true
            });
            document.getElementById('video').src = window.URL.createObjectURL(stream);
            webrtc.joinRoom(App.gameId);
        },
        viewVideo: function(video, context, canvas) {
            console.log(video);
            context.drawImage(video, 0, 0, context.width, context.height);
            socket.emit('stream', canvas.toDataURL('image/webp'));
        },
        loadFail : function () {
            console.log('fail');
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
                App.$gameArea.html(App.$templateJoinGame);
                $('#inputGameId').val(App.gameId);
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
            onUmoederClick: function() {
                var data = [App.gameId, App.player]
                IO.socket.emit('uMoeder', data);
            },
            onYtSearchClick: function() {
               // $('.thumbnail-wrapper').empty();
                //$('.iframe-wrapper').empty();
                $.get("http://localhost:3000/search/" + $('#youtube-search').val(), function(data, status){
                    console.log(data.items);
                    $.each( data.items, function( key, value ) {
                        $video_id = data.items[key].id.videoId;
                        $video_thumb = data.items[key].snippet.thumbnails.medium.url;
                        $( "<img id='"+ $video_id +"' src='" + $video_thumb + "' />" ).appendTo( ".thumbnail-wrapper" );
                        console.log("youtube url= https://www.youtube.com/watch?v="+ $video_id + "?autoplay=1");
                    });
                });
            },
            onYtVideoClick: function(ytUri) {
                var data = [App.gameId, App.player, ytUri]
                IO.socket.emit('ytVideo', data);
            },
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
            showVideo : function () {
                App.$gameArea.html(App.$startGame);

                var canvas = document.getElementById('preview');
                var context = canvas.getContext('2d');
            
                canvas.width = 800;
                canvas.height = 600;
            
                context.width = canvas.width;
                context.height = canvas.height;
            
                var video = document.getElementById('video');
            
                var socket = io.connect('http://localhost:3000');
            
                function logger(msg) {
                    $('#logger').text(msg);
                }
            
                function loadCam(stream) {
                    video.src = window.URL.createObjectURL(stream);
                    logger('camera werkt');
                }
            
                function loadFail() {
                    logger('camera werkt niet');
                }
            
                function viewVideo(video, context) {
                    context.drawImage(video, 0, 0, context.width, context.height);
                    socket.emit('stream', canvas.toDataURL('image/webp'));
                }

                navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

                if(navigator.getUserMedia) {
                    navigator.getUserMedia({video: true}, App.loadCam, App.loadFail);
                }

                setInterval(function() {
                    viewVideo(video, context);
                }, 1);
            },

        }
    };

    $(function() {
        $( ".thumbnail-wrapper" ).on( "click", 'img', function() {
            var $video_id = $(this).attr('id');
            $('.thumbnail-wrapper').empty();
           // $('.iframe-wrapper').empty();
            App.player.onYtVideoClick("//www.youtube.com/embed/" + $video_id);
        });
    });


    
    socket.on('stream', function(image) {

        var img = document.getElementById('play');
        if(img) {
            img.src = image; 
        }
    });
    $('#btnGifSearch').click(function() {
        searchGif();
    });

    IO.init();
    App.init();

}($));


var gifKey = "OUsWjpISlIIZOhQx9uAtVQjOeIUvA2Du";

var searchGif = function (){
    $("#gifList").empty();
    var searchValue = $('#gifSearch').val().split(' ').join('_');

    //javascript, jQuery
    var xhr = $.get("http://api.giphy.com/v1/gifs/search?q="+searchValue+"&api_key="+gifKey+"&limit=5");
    xhr.done(function(data) {

       $.each(data.data, function( key, value ) {
          $("#gifList").append(`
            <li>
                <img src="`+value.images.fixed_height_small.url+`"
                    onclick=sendGif("` +value.images.fixed_height_small.url+ `")>
            </li>`);
        });
        
    });
};

var sendGif = function(url){
    $("#sendGifList").empty();
    $("#sendGifList").append('<li><img src="'+url+'"></li>');
    $("#gifList").empty();
    socket.emit('gifurl',url);
    socket.on('gifurl', function(gif){
        $("#pis").append('<li><img src="'+gif+'"></li>');
    });
};