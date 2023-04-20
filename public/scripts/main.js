// when it runs, it console.logs that the user connected from the server
const socket = io();

// VARIABLES
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

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

// video for face

// source: https://usefulangle.com/post/352/javascript-capture-image-from-camera
// WEB API's cannot be used in server.js
const autodetectFoodButton = document.getElementById("autodetectFoodButton");
const dishNameInput = document.getElementById("dishName");

// you can draw on canvas
const canvas = document.getElementById("canvas");
const video = document.getElementById("video");

// if mediaDevices is supported, remove hidden class
if (navigator.mediaDevices) {
	autodetectFoodButton.classList.remove("hidden");
	autodetectFoodButton.addEventListener("click", async (e) => {
		// e.preventdefault because any button in a form will automatically submit the form, but that's not what i want to do.
		e.preventDefault();
		canvas.classList.add("hidden");
		video.classList.remove("hidden");
		// permission to use media with only video | source: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/mediaDevices
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: false,
		});
		// assign the camera to video | source
		video.srcObject = stream;
	});
} // code will execute after 1000 milliseconds (1 second)
