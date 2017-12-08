(function() {
    var App;
    App = {};
    /*
        Init 
    */
    App.init = function() {
      App.canvas = document.getElementById('send');
      App.canvas.height = 400;
      App.canvas.width = 500;
      //document.getElementsByTagName('article')[0].appendChild(App.canvas);
      App.ctx = App.canvas.getContext("2d");
      App.ctx.fillStyle = "solid";
      App.ctx.strokeStyle = "#ECD018";
      App.ctx.lineWidth = 5;
      App.ctx.lineCap = "round";
      App.socket = io();
      App.draw = function(x, y, type) {
        if (type === "dragstart") {
          App.ctx.beginPath();
          return App.ctx.moveTo(x, y);
        } else if (type === "drag") {
          App.ctx.lineTo(x, y);
          return App.ctx.stroke();
        } else {
          return App.ctx.closePath();
        }
      };

      App.socket.on('draw', function(data) {
        // broadcasten
        //App.socket.broadcast.emit('drawing', );
        App.draw(data.x, data.y, data.type);
      });

      App.canvasReceiver = document.getElementById('receive');
      App.canvasRec = App.canvasReceiver.getContext("2d");
      App.canvasReceiver.width = 400;
      App.canvasReceiver.height = 500;

      App.socket.on('connection', function(socket) {
        socket.on('drawClick', function(data) {
          socket.broadcast.emit('draw',{ x : data.x, y : data.y, type: data.type});
        })
      });


    };
    /*
        Draw Events
    */
    $('canvas').live('drag dragstart dragend', function(e) {
      var offset, type, x, y;
      type = e.handleObj.type;
      offset = $(this).offset();
      e.offsetX = e.layerX - offset.left;
      e.offsetY = e.layerY - offset.top;
      x = e.offsetX;
      y = e.offsetY;
      App.draw(x, y, type);
      App.socket.emit('drawClick', {
        x: x,
        y: y,
        type: type
      });
    });
    $(function() {
      return App.init();
    });
  }).call(this);
