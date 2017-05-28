const socketIO = require('socket.io');
const express = require('express');
const path = require('path');
const http = require('http');

// const { generateMessage } = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

// Setup a listener for a connection.
io.on('connection', (socket) => {
  console.log('new user connected');

  socket.on('disconnect', () => {
    console.log('client disconnected');
  });
});

/*
Call server.listen instead of app.listen to use the http server instead
of the express server. This is necessary in order to use socket.io.
*/
server.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
