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
});

// socket.emit('createMessage', {
//   from: 'Frank',
//   text: 'HI'
// }, function (data) {
//   console.log('Got it', data);
// });

socket.on('newLocationMessage', function (message) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.textContent = 'My current location';
  a.setAttribute('target', '_blank');
  li.textContent = `${message.from}: `;
  a.setAttribute('href', message.url);
  li.append(a);
  messages.appendChild(li);
});

const form = document.querySelector('#message-form');
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const messageText = this.querySelector('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: messageText.value
  }, function () {
    messageText.value = '';
  });
});

const locationButton = document.querySelector('#send-location')
locationButton.addEventListener('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  locationButton.setAttribute('disabled', true);
  locationButton.textContent = 'Sending Location...';

  navigator.geolocation.getCurrentPosition(function (position) {
  locationButton.removeAttribute('disabled');
  locationButton.textContent = 'Send Location';
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttribute('disabled');
    locationButton.textContent = 'Send Location';
    alert('Unable to fetch location.');
  });
});
