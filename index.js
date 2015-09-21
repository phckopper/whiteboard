var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var uuid = require('node-uuid');

server.listen(3000);

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.emit('id', { id: uuid.v4() });
  socket.on('update:user', function (data) {
    io.emit('update:server', data) //very inefficient, should be optimized
    console.log(data);
  });
  socket.on('draw', function (data) {
    console.log('user ' + data.id + ' wants to draw');
  });
});