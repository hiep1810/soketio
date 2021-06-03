const socket = io.connect(window.location.origin);
let room;
// const socket = io.connect(window.location.origin);

let username = document.getElementById('username');

let btnSubmitUsername = document.getElementById('btn-username');

btnSubmitUsername.addEventListener('click', () => {
  if (!username.value.trim()) {
    console.log(username.value.trim());
  } else {
    console.log('submit 2 people chat');
    socket.emit('2-people-chat', { id: username.value.trim() });
  }
});

let message = document.getElementById('message');
let btnSendMessage = document.getElementById('btn-send-message');

btnSendMessage.addEventListener('click', () => {
  if (!message.value.trim()) {
  } else if (room === undefined) {
  } else {
    console.log(message.value);
    socket.emit('chat', { room: room, message: message.value });
  }
});
socket.on('connect', () => {
  let userIdDiv = document.getElementById('user-id');
  userIdDiv.innerHTML = 'Your id: ' + socket.id;
});

socket.on('online-list', (data) => {
  let onlineListDiv = document.getElementById('online-list');
  let listUserDiv = document.getElementById('online-list-user');

  onlineListDiv.innerHTML = '';
  listUserDiv.innerHTML = '';

  let onlineList = data.list;

  for (let i = 0; i < onlineList.length; i++) {
    let onlineUserNode = document.createElement('li');
    let groupUserNode = document.createElement('li');

    onlineUserNode.value = i;

    if (onlineList[i] === socket.id) {
      onlineUserNode.innerText = onlineList[i] + ` --- It's you`;
      groupUserNode.innerHTML = `<div><span>${onlineList[i]}<input type="checkbox" id="${onlineList[i]}"/> --- It's you<span></div>`;
    } else {
      onlineUserNode.innerText = onlineList[i];
      groupUserNode.innerHTML = `<div><span>${onlineList[i]}<span><input type="checkbox" id="${onlineList[i]}"/></div>`;
    }

    onlineListDiv.appendChild(onlineUserNode);
    listUserDiv.appendChild(groupUserNode);
  }
});

socket.on('confirm', (data) => {
  room = data.room;
  socket.emit('join-room', { room: data.room });
});

socket.on('chat', (data) => {
  let messageDiv = document.getElementById('messages');
  let textNode = document.createTextNode(data.id + ': ' + data.message);
  messageDiv.appendChild(textNode);
  messageDiv.appendChild(document.createElement('br'));
});

socket.on('disconnect', function () {
  //alert('Socket is disconnected.');
});

var btnSendFile = document.getElementById('btn-send-file');
btnSendFile.addEventListener('change', function () {
  var file = this.files[0];
  if (file) {
    console.log(file.type);
    var reader = new FileReader();
    console.log(file);
    reader.onload = function (event) {
      //console.log(event);
      var arrayBuffer = reader.result;
      socket.emit('buffer', { buffer: arrayBuffer, room: room });
    };
    reader.onerror = function (evt) {
      console.error('Error');
    };

    reader.readAsArrayBuffer(file);
  }
  //console.log(btnSendFile.files[0]);
});
var a = document.createElement('a');
a.innerHTML = 'CLick here to download';
document.body.appendChild(a);
a.style = 'display: none';

socket.on('buffer', async (data) => {
  //console.log(data.buffer);
  //console.log(data.buffer instanceof ArrayBuffer);
  var blob = new Blob([data.buffer]);

  url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = 'image.png';
  a.click();
  //window.URL.revokeObjectURL(url);
});
