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

app.get('/', function (req, res) {
  res.render('index');
});

// SOCKET IO EVENTS

// chat
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('message', (message) => {
    io.emit('message', message);
  });
  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
});

// canvas to img
io.on('canvasImage', (dataURL) => {
  // create new img object from the dataURL
  const img = new Image();
  img.src = dataURL;

  // create new canvas and draw the img on it
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  // convert the canvas to png buffer
  const buffer = canvas.toBuffer('image/png');
});

server.listen(port);
