var _io;
var onlineList = [];

function listen(socket) {
  let io = _io;

  //push:
  onlineList.push(socket.id);
  io.emit('online-list', { list: onlineList });

  socket.on('2-people-chat', (data) => {
    //console.log('server-on-2-people-chat');
    let room = socket.id + '_' + data.id + Date.now();

    socket.emit('confirm', { room });

    //io.to(room).emit('chat', { id: socket.id, message: socket.id + ' joined' });

    socket.to(data.id).emit('confirm', { id: socket.id, room });
  });

  socket.on('join-room', (data) => {
    //console.log('room: ' + data.room);
    socket.join(data.room);
    //   socket
    //     .to(data.room)
    //     .emit('chat', { id: socket.id, message: socket.id + ' has joined' });
    //
  });

  socket.on('online-list', () => {
    io.emit('online-list', { list: onlineList });
  });

  socket.on('disconnect', () => {
    console.log(socket.id + ' has disconnected');
    onlineList = onlineList.filter((value) => value !== socket.id);
    io.emit('online-list', { list: onlineList });
  });
  socket.on('chat', (data) => {
    if (data.room) {
      // console.log('message: ' + data.message);
      io.to(data.room).emit('chat', { id: socket.id, message: data.message });
    } else if (data.id) {
      io.to(id).emit('chat', { id: socket.id, message: data.message });
    }
  });
  socket.on('buffer', (data) => {
    //console.log('buffer: ');
    socket.to(data.room).emit('buffer', { image: true, buffer: data.buffer });
  });
}

module.exports = (io) => {
  _io = io;
  return { listen };
};
