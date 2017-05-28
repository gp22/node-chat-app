const socket = io();
// Setup a listener for a connection.
socket.on('connect', () => {
  console.log('connected to server');
  /*
  Setup a new event emitter inside of socket.on('connect') so
  we make sure we're connected before emitting the event.
  */
  socket.emit('createMessage', {
    from: 'amy',
    text: 'yes'
  });
});

socket.on('disconnect', () => {
  console.log('disconnected from server');
});

// Setup a custom event listener.
socket.on('newMessage', function (message) {
  console.log('newMessage', message);
});
