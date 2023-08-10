var express = require("express");
var app = express();
app.get("/", function (req, res) {
  res.send("Hello World!");
});
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});

const net = require("net");

// Device configuration

const server = net.createServer((socket) => {
  console.log("Client connected");

  // Listen for data from the client
  socket.on("data", (data) => {
    console.log(`Received data: ${data.toString()}`);

    // Echo the received data back to the client
    socket.write(`Server received: ${data}`);
  });

  // Listen for the client to close the connection
  socket.on("end", () => {
    console.log("Client disconnected");
  });
});

const port = 8080; // Port number to listen on

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const client = new net.Socket();

const io = require("socket.io-client");

const clientSocket = io("http://localhost:8080"); // Replace with your server's URL

clientSocket.on("connect", () => {
  console.log("Connected to server");
});

clientSocket.on("data", (data) => {
  console.log(`Received from server: ${data.toString()}`);
  // Close the connection
  //   client.end();
});

// client.connect(8080, "127.0.0.1", () => {
//   console.log("Connected to server");

//   // Send data to the server
//   client.write("Hello, server!");
// });

// client.on("data", (data) => {
//   console.log(`Received from server: ${data.toString()}`);

//   // Close the connection
//   client.end();
// });

// client.on("end", () => {
//   console.log("Connection closed");
// });
