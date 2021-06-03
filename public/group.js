var groups = [];
var currentGroup;

var onlineListUser = document.getElementById('online-list-user');
var listGroup = document.getElementById('list-group');
var groupMessage = document.getElementById('group-message');
var btnSendGroupMess = document.getElementById('btn-group-send-message');
var groupMessages = document.getElementById('group-messages');

var btnCreateGroup = document.getElementById('create-group');
var txtGroupName = document.getElementById('txt-group-name');

btnCreateGroup.addEventListener('click', function () {
  console.log(!!txtGroupName.value);
  console.log(txtGroupName.innerText);

  if (!!txtGroupName.value) {
    var listAddToGroup = [];
    var flag = 0;
    for (let i = 0; i < onlineListUser.children.length; i++) {
      if (onlineListUser.children[i].querySelector('input').id != socket.id) {
        if (onlineListUser.children[i].querySelector('input').checked) {
          flag = 1;
          listAddToGroup.push(
            onlineListUser.children[i].querySelector('input').id
          );
        }
      }
    }

    if (flag) {
      console.log('emit');
      socket.emit('create-group', {
        group: txtGroupName.value,
        users: listAddToGroup,
      });
    }
  }
});

socket.on('group-list', (data) => {
  console.log('group-list' + data);
  listGroup.innerHTML = '';
  let groupList = data.group;

  for (let i = 0; i < groupList.length; i++) {
    let groupNode = document.createElement('li');
    groupNode.value = i;

    // groupNode.innerText = groupList[i].group;
    groupNode.innerHTML = `<div>${groupList[i].group}</div>`;
    listGroup.appendChild(groupNode);
  }
});

socket.on('group-confirm', (data) => {
  console.log('group confirm');
  currentGroup = data.group;
  socket.emit('join-group', { group: data.group });
  currentGroup = data.group;
});

socket.on('group-chat', (data) => {
  //id, message, group
  if (currentGroup === data.group) {
    let messageDiv = document.getElementById('messages');
    let textNode = document.createTextNode(data.id + ': ' + data.message);
    messageDiv.appendChild(textNode);
    messageDiv.appendChild(document.createElement('br'));
  }
});
