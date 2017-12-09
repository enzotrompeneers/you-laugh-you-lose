var socket;

function setup(){

    createCanvas(500,500);
    background(0);
    socket = io.connect('http://localhost:3000');
    
    socket.on('mouse',
    function(data){
        console.log("Got: " + data.x + " " + data.y);
        fill(0,0,255);
        noStroke();
        ellipse(data.x, data.y, 8, 8);
    });
}

function mouseDragged(){
    fill(255);
    noStroke();
    ellipse(mouseX,mouseY,8,8);
    sendmouse(mouseX,mouseY);
}

function sendmouse(xpos,ypos){
    console.log("Sending mouse coördinates: " + xpos + " " + ypos);
    var data = {
        x: xpos,
        y: ypos
    };

    socket.emit('mouse', data);
}