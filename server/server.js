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

server.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
