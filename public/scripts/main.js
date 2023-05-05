// VARIABLES----------------------
// when it runs, it console.logs that the user connected from the server
const socket = io();
const messages = document.getElementById("messages");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
// last known position for canvas
const pos = { x: 0, y: 0 };
// buttons for eyes
const dotEyesButton = document.getElementById("dot__eyes__button");
const stripeEyesButton = document.getElementById("stripe__eyes__button");
const horizontalEyesButton = document.getElementById("horizontal__eyes__button");
// to send canvas
const sendCanvasButton = document.getElementById("send__emoji");

// FUNCTIONS TO DRAW ON THE CANVAS----------------------
// new position from mouse or touch event
const setPosition = (e) => {
	const rect = canvas.getBoundingClientRect();
	if (e.type.startsWith("mouse")) {
		pos.x = e.clientX - rect.left;
		pos.y = e.clientY - rect.top;
	} else if (e.type.startsWith("touch")) {
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
	if (e.buttons !== 1 && e.type.startsWith("mouse")) return;

	ctx.beginPath(); // begin

	ctx.lineWidth = 2;
	ctx.lineCap = "round";
	ctx.strokeStyle = "#000000";

	ctx.moveTo(pos.x, pos.y); // from
	setPosition(e);
	ctx.lineTo(pos.x, pos.y); // to

	ctx.stroke(); // draw it!
};

// TO CHAT----------------------
form.addEventListener("submit", (e) => {
	// prevents the form from refreshing the page everytime you send a message
	e.preventDefault();
	if (input.value) {
		// server emits the message to multiple clients
		socket.emit("message", input.value);
		input.value = "";
	}
});
socket.on("message", (msg) => {
	const item = document.createElement("li");
	item.textContent = msg;
	messages.appendChild(item);
	window.scrollTo(0, document.body.scrollHeight);
});

// WHEN STARTING UP THE APP:----------------------
window.onload = function () {
	// When starting up, the face with round eyes is selected
	dotEyesButton.checked = "true";
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.arc(100, 100, 75, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.beginPath();
	//DOT EYES DEFAULT: left right
	ctx.beginPath();
	ctx.arc(74, 86, 7, 0, 2 * Math.PI);
	ctx.lineWidth = 1;
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(125, 85, 7, 0, 2 * Math.PI);
	ctx.lineWidth = 1;
	ctx.stroke();
};

// EVENT LISTENERS----------------------

// FOT CLICKING ON RADIO BUTTONS
dotEyesButton.addEventListener("click", function () {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.arc(100, 100, 75, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.beginPath();
	//DOT EYES DEFAULT: left right
	ctx.beginPath();
	ctx.arc(74, 86, 7, 0, 2 * Math.PI);
	ctx.lineWidth = 1;
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(125, 85, 7, 0, 2 * Math.PI);
	ctx.lineWidth = 1;
	ctx.stroke();
});

horizontalEyesButton.addEventListener("click", function () {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.arc(100, 100, 75, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.beginPath();
	// HORITZONTAL EYES: left, right
	ctx.fillRect(62, 85, 25, 2);
	ctx.fillRect(113, 85, 25, 2);
});

stripeEyesButton.addEventListener("click", function () {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.arc(100, 100, 75, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.beginPath();
	// STRIPE EYES: left, right
	ctx.fillRect(73, 70, 2, 30);
	ctx.fillRect(124, 70, 2, 30);
});

// SEND CANVAS AS PNG
sendCanvasButton.addEventListener("click", function () {
	// convert canvas to data URL
	const dataURL = canvas.toDataURL("image/png");
	// send dataURL to server with socket.io
	socket.emit("canvasImage", dataURL);
});

// EVENT LISTENERS FOR MOUSE AND TOUCH EVENTS----------------------
canvas.addEventListener("mousedown", setPosition);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseenter", setPosition);
canvas.addEventListener("touchstart", setTouchPosition);
canvas.addEventListener("touchmove", draw);
