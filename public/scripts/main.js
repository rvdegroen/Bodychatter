// VARIABLES----------------------
// when it runs, it console.logs that the user connected from the server
const socket = io();
const messages = document.getElementById('messages');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
// last known position for canvas
const pos = { x: 0, y: 0 };
// buttons for eyes
const dotEyesButton = document.querySelector('.dot_eyes');
const stripeEyesButton = document.querySelector('.stripe_eyes');
const horizontalEyesButton = document.querySelector('.horizontal_eyes');
const trashButton = document.querySelector('.trash');
// canvas related diy emoji
const openDiyEmoji = document.getElementById('create__emoji');
const closeDiyEmoji = document.getElementById('cancel__emoji');
const sendCanvasButton = document.getElementById('emoji');
const dialog = document.querySelector('dialog');
const radioButtons = document.querySelectorAll('input[type="radio"]');
// username queryparam
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');

// FUNCTIONS TO DRAW ON THE CANVAS----------------------
// new position from mouse or touch event
const setPosition = (e) => {
  const rect = canvas.getBoundingClientRect();
  if (e.type.startsWith('mouse')) {
    pos.x = e.clientX - rect.left;
    pos.y = e.clientY - rect.top;
  } else if (e.type.startsWith('touch')) {
    pos.x = e.touches[0].clientX - rect.left;
    pos.y = e.touches[0].clientY - rect.top;
  }
};

const setTouchPosition = (e) => {
  e.preventDefault();
  setPosition(e);
};

const draw = (e) => {
  // mouse left button must be pressed, otherwise you draw without holding click
  // 1 is the primary button (left mouse btn), 2 secondary, 3 primary + secondary
  if (e.buttons !== 1 && e.type.startsWith('mouse')) return;

  ctx.beginPath(); // begin

  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'white';

  ctx.moveTo(pos.x, pos.y); // from
  setPosition(e);
  ctx.lineTo(pos.x, pos.y); // to

  ctx.stroke(); // draw it!
};

// TO CHAT & SOCKET.IO----------------------

// send to the server and emit message object
form.addEventListener('submit', (e) => {
  // prevents the form from refreshing the page everytime you send a message
  e.preventDefault();
  if (input.value) {
    // server emits the message to multiple clients
    socket.emit('message', { message: input.value, username });
    input.value = '';
  }
});

// received from the server: what will be done with message in the client
socket.on('message', (msg) => {
  const item = document.createElement('li');
  item.textContent = `${msg.username}: ${msg.message}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

// send canvas as PNG to the server and emit this as object image and username
sendCanvasButton.addEventListener('submit', (e) => {
  console.log('send canvas');
  e.preventDefault();
  console.log(canvas.toDataURL('image/png'));
  socket.emit('canvasImage', {
    // my own stuff
    image: canvas.toDataURL('image/png'),
    username,
  });
  dialog.close();
});

// receives object 'canvasImage', (imageMessage) from server that contains image and username and what will be done with it in the client:
socket.on('canvasImage', (imageMessage) => {
  // img element is created with a source (from the canvasImage source in app.js and line 86 in main.js)
  const img = document.createElement('img');
  img.src = imageMessage.image;
  // creates a textnode containing the username of the user who sent the image for within the li element
  const message = `${imageMessage.username}: `;
  const usernameTextNode = document.createTextNode(message);
  // create a new li element and append the username text node to it
  const messageElem = document.createElement('li');
  messageElem.appendChild(usernameTextNode);
  // append the image element to the same li element
  messageElem.appendChild(img);
  // append the new li element to the messages ul element
  messages.appendChild(messageElem);
  window.scrollTo(0, document.body.scrollHeight);
});

// WHEN STARTING UP THE APP:----------------------
window.onload = function () {
  // When starting up, the face with round eyes is selected
  dotEyesButton.checked = 'true';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(100, 100, 75, 0, 2 * Math.PI);
  ctx.lineWidth = 5; // set line width to 5 pixels
  ctx.strokeStyle = 'white'; // set stroke style to white
  ctx.stroke();

  //DOT EYES DEFAULT: left right
  ctx.beginPath();
  ctx.arc(74, 86, 9, 0, 2 * Math.PI);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'white';
  ctx.fillStyle = 'white';
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(125, 85, 9, 0, 2 * Math.PI);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'white';
  ctx.fillStyle = 'white';
  ctx.stroke();
  ctx.fill();
};

// EVENT LISTENERS----------------------
// SO I CAN USE ARROW LEFT RIGHT IN DIALOG FOR RADIO BUTTONS
radioButtons.forEach((radioButton) => {
  radioButton.addEventListener('keydown', (event) => {
    if (
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight'
    ) {
      event.stopPropagation();
    }
  });
});

// FOR CLICKING ON DIY EMOJI DIALOG src: https://www.youtube.com/watch?v=ywtkJkxJsdg
openDiyEmoji.addEventListener('click', function () {
  // turn later into modal
  dialog.showModal();
});

closeDiyEmoji.addEventListener('click', function () {
  dialog.close();
});

// close dialog when clicking outside the box
dialog.addEventListener('click', (e) => {
  // src: https://blog.webdevsimplified.com/2023-04/html-dialog/
  const dialogDimensions = dialog.getBoundingClientRect();
  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    dialog.close();
  }
});

// FOT CLICKING ON RADIO BUTTONS
// FOT CLICKING ON RADIO BUTTONS
trashButton.addEventListener('click', function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(100, 100, 75, 0, 2 * Math.PI);
  ctx.lineWidth = 5; // set line width to 5 pixels
  ctx.strokeStyle = 'white';
  ctx.stroke();
});

dotEyesButton.addEventListener('click', function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(100, 100, 75, 0, 2 * Math.PI);
  ctx.lineWidth = 5; // set line width to 5 pixels
  ctx.strokeStyle = 'white';
  ctx.stroke();
  //DOT EYES DEFAULT: left right
  ctx.beginPath();
  ctx.arc(74, 86, 9, 0, 2 * Math.PI);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'white';
  ctx.fillStyle = 'white';
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(125, 85, 9, 0, 2 * Math.PI);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'white';
  ctx.fillStyle = 'white';
  ctx.stroke();
  ctx.fill();
});

horizontalEyesButton.addEventListener('click', function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(100, 100, 75, 0, 2 * Math.PI);
  ctx.lineWidth = 5; // set line width to 5 pixels
  ctx.strokeStyle = 'white';
  ctx.fillStyle = 'white';
  ctx.stroke();
  // HORITZONTAL EYES: left, right
  ctx.lineWidth = 5;
  ctx.strokeRect(62, 85, 25, 2);
  ctx.strokeRect(113, 85, 25, 2);
});

stripeEyesButton.addEventListener('click', function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(100, 100, 75, 0, 2 * Math.PI);
  ctx.lineWidth = 5; // set line width to 5 pixels
  ctx.stroke();
  // STRIPE EYES: left, right
  ctx.lineWidth = 5;
  ctx.strokeRect(73, 70, 2, 30);
  ctx.strokeRect(124, 70, 2, 30);
});

// EVENT LISTENERS FOR MOUSE AND TOUCH EVENTS----------------------
canvas.addEventListener('mousedown', setPosition);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseenter', setPosition);
canvas.addEventListener('touchstart', setTouchPosition);
canvas.addEventListener('touchmove', draw);
