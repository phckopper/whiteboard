var id;
var socket;
var color;
var firstTouch = {}; //hmmmm foreplay (i should go to sleep)
var lastUpdate = 0;

var getRandomColor = function() {
  return '#' + Math.floor(Math.random()*16777215).toString(16); //hackety hack
}

var handleOrientation = function(event) {
  var beta  = event.beta;
  var gamma = event.gamma;
  var now = Date.now();

  if(id && (now - lastUpdate) > 30) //only send data if client has already received it's uuid and enough time has elapsed
    socket.emit('update:user', {x: gamma, y: beta, id: id, color: color});
  last = Date.now();
}

window.onload = function() {
  //setup data
  color = getRandomColor();
  document.body.style.backgroundColor = color; 
  socket = io();
  socket.on('id', function(data) {
    id = data.id;
  });

  //initialize handlers
  window.onclick = function() {
    color = getRandomColor();
    document.body.style.backgroundColor = color;
  }
  window.addEventListener("deviceorientation", handleOrientation, true);
  window.addEventListener('touchstart', function(e) {
    firstTouch = {
      x: e.changedTouches[0].pageX,
      y: e.changedTouches[0].pageY
    }
  });
  window.addEventListener('touchend', function(e) {
    var touch = e.changedTouches[0];
    if(firstTouch.y - touch.pageY > window.innerHeight/7 && Math.abs(firstTouch.x - touch.pageX) < window.innerWidth/2 ) {
      socket.emit("draw", {id: id})
    }
    //alert('touchend at' + e.changedTouches[0].pageX + e.changedTouches[0].pageY);
  });
}
