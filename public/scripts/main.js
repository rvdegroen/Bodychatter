// VARIABLES
// when it runs, it console.logs that the user connected from the server
const socket = io();
const messages = document.getElementById("messages");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
// last known position for canvas
const pos = { x: 0, y: 0 };

// chat send button
form.addEventListener("submit", (e) => {
	// prevents the form from refreshing the page everytime you send a message
	e.preventDefault();
	if (input.value) {
		// server emits the message to multiple clients
		socket.emit("message", input.value);
		input.value = "";
	}
});

// server chat
socket.on("message", (msg) => {
	const item = document.createElement("li");
	item.textContent = msg;
	messages.appendChild(item);
	window.scrollTo(0, document.body.scrollHeight);
});
// src: https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
// new position from mouse event
const setPosition = (e) => {
	pos.x = e.offsetX;
	pos.y = e.offsetY;
};

const draw = (e) => {
	// mouse left button must be pressedm otherwise you draw without holding click
	// 1 is the primary button (left mouse btn), 2 secondary, 3 primary + secondary
	if (e.buttons !== 1) return;

	ctx.beginPath(); // begin

	ctx.lineWidth = 5;
	ctx.lineCap = "round";
	ctx.strokeStyle = "#c0392b";

	ctx.moveTo(pos.x, pos.y); // from
	setPosition(e);
	ctx.lineTo(pos.x, pos.y); // to

	ctx.stroke(); // draw it!
};

// pre-draw circle on canvas
ctx.beginPath();
ctx.arc(100, 100, 50, 0, 2 * Math.PI);
ctx.stroke();

// EVENT LISTENERS
document.addEventListener("mousemove", draw);
document.addEventListener("mousedown", setPosition);
document.addEventListener("mouseenter", setPosition);
