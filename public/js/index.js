const socket = io();
// Setup a listener for a connection.
socket.on('connect', () => {
  console.log('connected to server');
  /*
  Setup a new event emitter inside of socket.on('connect') so
  we make sure we're connected before emitting the event.
  */
  // socket.emit('createMessage', {
  //   from: 'amy',
  //   text: 'yes'
  // });
});

socket.on('disconnect', () => {
  console.log('disconnected from server');
});

// Setup a custom event listener.
const messages = document.querySelector('#messages');
socket.on('newMessage', function (message) {
  console.log('newMessage', message);
  const li = document.createElement('li');
  li.textContent = `${message.from}: ${message.text}`;
  messages.appendChild(li);
  // console.log(li);
});

// socket.emit('createMessage', {
//   from: 'Frank',
//   text: 'HI'
// }, function (data) {
//   console.log('Got it', data);
// });

const form = document.querySelector('#message-form');
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const text = this.querySelector('[name=message]').value;
  socket.emit('createMessage', {
    from: 'User',
    text
  }, function () {
    
  });
});
