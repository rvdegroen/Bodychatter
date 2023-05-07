// VARIABLES
const socket = io();
const loginForm = document.getElementById('login__form');
const usernameInput = document.getElementById('username__input');

// EVENTLISTENERS
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = usernameInput.value;
  // save username as queryparam encoded, because spaces for example, cant be put in a url
  // its a component, because its part of the url and not the complete url with https..
  const url = `/chat?username=${encodeURIComponent(username)}`;
  socket.emit('login', username);

  //   re-direct to chat
  window.location.href = url;
});
