(function() {

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
        console.log(stream);
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
        navigator.getUserMedia({video: true}, loadCam, loadFail);
    }

    setInterval(function() {
        viewVideo(video, context);
    }, 1);
})();