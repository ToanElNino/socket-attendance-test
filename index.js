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

// const io = require("socket.io-client");

// const clientSocket = io("http://localhost:8080"); // Replace with your server's URL

// clientSocket.on("connect", () => {
//   console.log("Connected to server");
// });

// clientSocket.on("data", (data) => {
//   console.log(`Received from server: ${data.toString()}`);
//   // Close the connection
//   //   client.end();
// });

const ZKLib = require("./node_modules/node-zklib/zklib");
const ping = require("ping");

const test = async () => {
  let i = 30;
  while (1) {
    console.log("-----------");
    if (i >= 256) {
      console.log("end loop");
      break;
    }
    const ipAddress = `192.168.1.${i}`;
    console.log("checking ping ip address: ", ipAddress);
    const res = await ping.promise
      .probe(ipAddress, {
        timeout: 2,
      })
      .then((alive) => {
        console.log("alive: ", alive.alive);
        return alive.alive;
      });
    if (!res) {
      console.log("cannot ping device ", ipAddress);
      i++;
    } else {
      let zkInstance = new ZKLib(`192.168.1.${i}`, 4370, 2000, 4000);
      try {
        // Create socket to machine
        console.log(`trying to connect to device at ip 192.168.1.${i}`);
        await zkInstance.createSocket();
        console.log(await zkInstance.getInfo());
        console.log(`connect succeed: 192.168.1.${i}`);
        break;
      } catch (e) {
        console.log(e);
        console.log(`failed to connect to device at ip 192.168.1.${i}`);
        if (e.code === "EADDRINUSE") {
        }
      } finally {
        i++;
      }
    }
  }

  // Get users in machine
  const users = await zkInstance.getUsers();
  console.log(users);
  await zkInstance.disconnect();
};

test();
