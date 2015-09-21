var socket;
var pointers = {};

window.onresize = function() {
  var canvas = document.querySelector('canvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

var updateCanvas = function() {
  var canvas = document.querySelector('canvas');
  var ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height); //clears for redraw

  for(var key in pointers) {
    var pointer = pointers[key];

    if(Date.now() - pointer.lastUpdate < 5000) { //only continue if pointer is new (5 seconds)

      var x = (pointer.x/90) * canvas.width/2 * 2; //some gain
      var y = (pointer.y/90) * canvas.height/2 * -3; //chrome gives inverted y data (+some gain so it feels more responsive)

      ctx.beginPath()
      ctx.arc(canvas.width/2 + x, canvas.height/2 + y, 10, 0, Math.PI*2, true);

      ctx.fillStyle = pointer.color;
      ctx.fill();
    }
  }

  //only strike in the end
  ctx.stroke();

  requestAnimationFrame(updateCanvas);
}

var handleUpdate = function(data) {
  var now = Date.now();
  pointers[data.id] = data;
  pointers[data.id]['lastUpdate'] = now;
}

window.onload = function() {
  socket = io();

  window.onresize(); //force canvas fit
  socket.on('update:server', handleUpdate);
  requestAnimationFrame(updateCanvas);
}
