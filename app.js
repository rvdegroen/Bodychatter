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

  // message is an object from main.js that contains the input.value and the username
  socket.on('message', (message) => {
    io.emit('message', message);
  });

  // user disconnected
  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });

  // imageMessage is an object from main.js that contains the canvas image and the username
  socket.on('canvasImage', (imageMessage) => {
    io.emit('canvasImage', imageMessage);
  });
});

server.listen(port);
