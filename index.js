const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));
// app.set('views', path.join(__dirname, "views"));
// app.set('view engine', 'ejs');

let server = require('http').Server(app);

let port = 3000;

//socket.io
let io = require('socket.io')(server, {
  cors: {
    origin: 'https://localhost:8081',
    credentials: true,
  },
});

io.sockets.on('error', (e) => {
  console.log(e.message);
});

let service = require('./socketio_service/service')(io);

io.on('connection', (socket) => {
  console.log(socket.id + ' has connected to server');
  service.listen(socket);
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
