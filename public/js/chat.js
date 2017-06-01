const socket = io();

function scrollToBottom() {
  // Selectors
  const messages = jQuery('#messages');
  const newMessage = messages.children('li:last-child');
  // Heights
  const clientHeight = messages.prop('clientHeight');
  const scrollTop = messages.prop('scrollTop');
  const scrollHeight = messages.prop('scrollHeight');
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

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
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const template = jQuery('#message-template').html();
  const html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const template = jQuery('#location-message-template').html();
  const html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
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
