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
io.on('connection', function (socket) {
  console.log('new user connected');

  // Emit custom newEmail event we're listening for in the client.
  // socket.emit('newMessage', {
  //   from: 'mike@example.com',
  //   text: 'Hey, what\'s up?',
  // });

  socket.emit('newMessage', {
      from: 'Admin',
      text: 'Welcome to the chat app',
      createdAt: new Date().getTime()
  });

  socket.broadcast.emit('newMessage', {
      from: 'Admin',
      text: 'New user joined',
      createdAt: new Date().getTime()
  });

  socket.on('createMessage', (message) => {
    console.log('createMessage', message);
    // io.emit emits events to every connection.
    // io.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
    // socket.broadcast sends an event to everyone except the sending socket.
    socket.broadcast.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  });

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
