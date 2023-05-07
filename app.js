// IMPORTS src: https://socket.io/get-started/chat
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { createCanvas, loadImage } = require('canvas');

// VARIABLES
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4848;
const io = new Server(server);

// MIDDLEWARE EXPRESS
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static('public'));

// ROUTES
app.get('/', function (req, res) {
  res.render('index');
});

app.get('/chat', function (req, res) {
  const { username } = req.query;
  res.render('chat', { username });
});

// SOCKET IO EVENTS

// chat
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('login', (username) => {
    socket.username = username;
    console.log('user logged in:', username);
  });

  socket.on('message', (message) => {
    io.emit('message', message);
  });
  // user disconnected
  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
  // canvas to img
  socket.on('canvasImage', (dataURL) => {
    io.emit('canvasImage', dataURL);
  });
});

server.listen(port);
