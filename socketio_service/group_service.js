var _io;
var groupList = [];

function listen(socket) {
  let io = _io;

  socket.on('group-chat', (data) => {
    socket.to(data.group).emit('group-chat', {
      id: data.id,
      username: data.username,
      messasge: data.message,
    });
  });

  socket.on('create-group', (data) => {
    console.log(data);
    for (let i = 0; i < data.users.length; i++) {
      socket.to(data.users[i].id).emit('group-confirm', { group: data.group });
    }
    socket.emit('group-confirm', { group: data.group });
    groupList.push({ group: data.group, users: data.users });
  });

  socket.on('join-group', (data) => {
    console.log('join-group', data);
    socket.join(data.group);
    var returnList = [];
    console.log('here' + JSON.stringify(groupList[0]));
    for (let i = 0; i < data.group.length; i++) {
      for (let j = 0; j < groupList.length; j++) {
        if (data.group[i] === groupList[j].group) {
          returnList.push(groupList[j]);
        }
      }
    }

    console.log('emit grup list');
    socket.emit('group-list', { group: returnList });
  });

  socket.on('group-list', (data) => {
    var returnList = [];
    for (let i = 0; i < data.group.length; i++) {
      for (let j = 0; j < groupList.length; j++) {
        if (data.group[i] === groupList[j].group) {
          returnList.push(groupList[j]);
        }
      }
    }
    socket.emit('group-list', { group: returnList });
  });
}

module.exports = (io) => {
  _io = io;
  return { listen };
};
