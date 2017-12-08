(function(){

})();

// (function(){

// ONDERSTAANDE CODE DIENT VOOR WEBCAM STREAM IN CANVAS
// WERKT NIET LOKAAL OMDAT getUserMedia() NIET MEER ONDERSTEUND
// WORDT IN http ENKEL IN https
//
// var     canvas = document.getElementById('canvas'),
//         context = canvas.getContext('2d'),
//         video = document.getElementById('video'),
//         vendorUrl = window.URL || window.webkitURL;

// navigator.getMedia =    navigator.getUserMedia ||
//                         navigator.webkitGetUserMedia ||
//                         navigator.mozGetUserMedia ||
//                         navigator.msGetUserMedia;

// navigator.getMedia({
//     video: true,
//     audio: false
// }, function(stream){
//     video.src = vendorUrl.createObjectURL(stream);
//     video.play();
// }, function(error) {
//     // An error has occured
//     // error.code
// });
// })();

// ONDERSTAANDE CODE DIENT VOOR HET TEKENEN IN CANVAS
// GEKOPIEËRD VAN https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
// var canvas, ctx, flag = false,
// prevX = 0,
// currX = 0,
// prevY = 0,
// currY = 0,
// dot_flag = false;

// var x = "black",
// y = 2;

// function init() {
//     canvas = document.getElementById('can');
//     ctx = canvas.getContext("2d");
//     w = canvas.width;
//     h = canvas.height;

//     canvas.addEventListener("mousemove", function (e) {
//         findxy('move', e)
//     }, false);
//     canvas.addEventListener("mousedown", function (e) {
//         findxy('down', e)
//     }, false);
//     canvas.addEventListener("mouseup", function (e) {
//         findxy('up', e)
//     }, false);
//     canvas.addEventListener("mouseout", function (e) {
//         findxy('out', e)
//     }, false);
// }

// function color(obj) {
//     switch (obj.id) {
//         case "green":
//             x = "green";
//             break;
//         case "blue":
//             x = "blue";
//             break;
//         case "red":
//             x = "red";
//             break;
//         case "yellow":
//             x = "yellow";
//             break;
//         case "orange":
//             x = "orange";
//             break;
//         case "black":
//             x = "black";
//             break;
//         case "white":
//             x = "white";
//             break;
//     }
//     if (x == "white") y = 14;
//     else y = 2;

// }

// function draw() {
//     ctx.beginPath();
//     ctx.moveTo(prevX, prevY);
//     ctx.lineTo(currX, currY);
//     ctx.strokeStyle = x;
//     ctx.lineWidth = y;
//     ctx.stroke();
//     ctx.closePath();
// }

// function erase() {
//     var m = confirm("Want to clear");
//     if (m) {
//         ctx.clearRect(0, 0, w, h);
//         document.getElementById("canvasimg").style.display = "none";
//     }
// }

// function save() {
// document.getElementById("canvasimg").style.border = "2px solid";
// var dataURL = canvas.toDataURL();
// document.getElementById("canvasimg").src = dataURL;
// document.getElementById("canvasimg").style.display = "inline";
// }

// function findxy(res, e) {
//     if (res == 'down') {
//         prevX = currX;
//         prevY = currY;
//         currX = e.clientX - canvas.offsetLeft;
//         currY = e.clientY - canvas.offsetTop;

//         flag = true;
//         dot_flag = true;
//         if (dot_flag) {
//             ctx.beginPath();
//             ctx.fillStyle = x;
//             ctx.fillRect(currX, currY, 2, 2);
//             ctx.closePath();
//             dot_flag = false;
//         }
//     }
//     if (res == 'up' || res == "out") {
//         flag = false;
//     }
//     if (res == 'move') {
//         if (flag) {
//             prevX = currX;
//             prevY = currY;
//             currX = e.clientX - canvas.offsetLeft;
//             currY = e.clientY - canvas.offsetTop;
//             draw();
//         }
//     }
// }
